import { WebSocketServer, WebSocket } from "ws";
import mediasoup from "mediasoup";
import { UniError } from "../../util/UniErrorHandler.js";
import videoMethode from "./videoMethodes.services.js";
import { DtlsParameters } from "mediasoup/node/lib/fbs/web-rtc-transport.js";
import { RtpParameters } from "mediasoup/node/lib/fbs/rtp-parameters.js";
import { RtpCapabilities } from "mediasoup/node/lib/rtpParametersTypes.js";
import { nanoid } from "nanoid";
import { Router, WebRtcTransport, Producer, Consumer } from "mediasoup/node/lib/types.js";

// ============= INTERFACES =============
interface TransportData {
    transport: WebRtcTransport;
    producers: Map<string, Producer>;
    consumers: Map<string, Consumer>;
}

interface Peer {
    id: string;
    ws: WebSocket;
    roomId: string;
    transports: Map<string, TransportData>;
}

interface Room {
    id: string;
    router: Router;
    peers: Map<string, Peer>;
}

type ActionType = 
    | "join" 
    | "getRouterRtpCapabilities" 
    | "createTransport" 
    | "connectTransport" 
    | "produce" 
    | "consume" 
    | "closeProducer"
    | "closeTransport"
    | "leave";

interface Message {
    actionType: ActionType;
    roomId?: string;
    Id?: string; // transportId
    dtlsParameters?: DtlsParameters;
    kind?: "audio" | "video";
    rtpParameters?: RtpParameters;
    producerId?: string;
    rtpCapabilities?: RtpCapabilities;
}

// ============= STATE MANAGEMENT =============
const rooms = new Map<string, Room>();
const peers = new Map<string, Peer>();

const port: number = process.env.WEBSOCKETPORTVIDEO ? Number(process.env.WEBSOCKETPORTVIDEO) : 9022;
const wss = new WebSocketServer({ port });

// ============= HELPER FUNCTIONS =============

async function getOrCreateRoom(roomId: string): Promise<Room> {
    let room = rooms.get(roomId);
    
    if (!room) {
        const router = await videoMethode.startConnection();
        room = {
            id: roomId,
            router,
            peers: new Map()
        };
        rooms.set(roomId, room);
        console.log(`📦 Room created: ${roomId}`);
    }
    
    return room;
}

function broadcastToRoom(roomId: string, excludePeerId: string | null, message: any) {
    const room = rooms.get(roomId);
    if (!room) return;
    
    room.peers.forEach((peer, peerId) => {
        if (peerId !== excludePeerId && peer.ws.readyState === WebSocket.OPEN) {
            try {
                peer.ws.send(JSON.stringify(message));
            } catch (error) {
                console.error(`❌ Error broadcasting to peer ${peerId}:`, error);
            }
        }
    });
}

function cleanupPeer(peerId: string) {
    const peer = peers.get(peerId);
    if (!peer) return;
    
    const room = rooms.get(peer.roomId);
    
    console.log(`🧹 Cleaning up peer: ${peerId}`);

    // Close all transports, producers, and consumers
    peer.transports.forEach((transportData) => {
        transportData.producers.forEach(producer => {
            producer.close();
            broadcastToRoom(peer.roomId, peerId, {
                action: "producerClosed",
                producerId: producer.id,
                peerId: peerId
            });
        });
        transportData.consumers.forEach(consumer => consumer.close());
        transportData.transport.close();
    });
    
    // Remove peer from room
    if (room) {
        room.peers.delete(peerId);
        
        broadcastToRoom(peer.roomId, null, {
            action: "peerLeft",
            peerId: peerId
        });
        
        // Clean up empty rooms
        if (room.peers.size === 0) {
            room.router.close();
            rooms.delete(peer.roomId);
            console.log(`🗑️  Room deleted: ${peer.roomId}`);
        }
    }
    
    peers.delete(peerId);
    console.log(`✅ Peer cleaned up: ${peerId}`);
}

// ============= MAIN SERVER =============

const runVideoServer = async () => {
    try {
        console.log('🚀 Starting many-to-many video server...');

        wss.on('connection', (ws: WebSocket, req: any) => {
            const peerId = nanoid(16);
            console.log(`🔌 New connection: ${peerId}`);
            
            let currentPeer: Peer | null = null;

            ws.on('message', async (message: string) => {
                try {
                    const messageData: Message = JSON.parse(message);
                    console.log(`📨 [${peerId}] ${messageData.actionType}`);

                    switch (messageData.actionType) {
                        case "join": {
                            if (!messageData.roomId) {
                                ws.send(JSON.stringify({ error: "roomId required" }));
                                return;
                            }

                            const room = await getOrCreateRoom(messageData.roomId);
                            
                            currentPeer = {
                                id: peerId,
                                ws,
                                roomId: messageData.roomId,
                                transports: new Map()
                            };
                            
                            peers.set(peerId, currentPeer);
                            room.peers.set(peerId, currentPeer);

                            // Get existing producers with optimization
                            const existingProducers: Array<{peerId: string, producerId: string, kind: string}> = [];
                            room.peers.forEach((peer, pId) => {
                                if (pId !== peerId) {
                                    peer.transports.forEach(td => {
                                        td.producers.forEach(producer => {
                                            existingProducers.push({
                                                peerId: pId,
                                                producerId: producer.id,
                                                kind: producer.kind
                                            });
                                        });
                                    });
                                }
                            });

                            // Send joined response immediately
                            ws.send(JSON.stringify({
                                action: "joined",
                                peerId: peerId,
                                roomId: messageData.roomId,
                                peers: Array.from(room.peers.keys()).filter(id => id !== peerId),
                                existingProducers
                            }));

                            // Broadcast new peer after sending response
                            broadcastToRoom(messageData.roomId, peerId, {
                                action: "newPeer",
                                peerId: peerId
                            });

                            console.log(`✅ [${peerId}] Joined room: ${messageData.roomId}`);
                            break;
                        }

                        case "getRouterRtpCapabilities": {
                            if (!currentPeer) {
                                ws.send(JSON.stringify({ error: "Must join room first" }));
                                return;
                            }

                            const room = rooms.get(currentPeer.roomId);
                            if (!room) {
                                ws.send(JSON.stringify({ error: "Room not found" }));
                                return;
                            }

                            await videoMethode.getRouterRtpCapabilities(ws, room.router);
                            break;
                        }

                        case "createTransport": {
                            if (!currentPeer) {
                                ws.send(JSON.stringify({ error: "Must join room first" }));
                                return;
                            }

                            const room = rooms.get(currentPeer.roomId);
                            if (!room) {
                                ws.send(JSON.stringify({ error: "Room not found" }));
                                return;
                            }

                            const transportId = nanoid(12);
                            const transport = await videoMethode.createTransportForService(room.router);

                            currentPeer.transports.set(transportId, {
                                transport,
                                producers: new Map(),
                                consumers: new Map()
                            });

                            // Optimized transport parameters
                            const transportParams = {
                                id: transport.id,
                                iceParameters: transport.iceParameters,
                                iceCandidates: transport.iceCandidates,
                                dtlsParameters: transport.dtlsParameters,
                                iceServers: [
                                    { urls: 'stun:stun.l.google.com:19302' },
                                    { urls: 'stun:stun1.l.google.com:19302' }
                                ]
                            };

                            ws.send(JSON.stringify({
                                action: "transportCreated",
                                Id: transportId,
                                transportParams
                            }));

                            console.log(`✅ [${peerId}] Transport created: ${transportId}`);
                            break;
                        }

                        case "connectTransport": {
                            if (!currentPeer || !messageData.Id || !messageData.dtlsParameters) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                return;
                            }

                            const transportData = currentPeer.transports.get(messageData.Id);
                            if (!transportData) {
                                ws.send(JSON.stringify({ error: "Transport not found" }));
                                return;
                            }

                            try {
                                await transportData.transport.connect({ 
                                    dtlsParameters: messageData.dtlsParameters 
                                });

                                ws.send(JSON.stringify({
                                    action: "transportConnected",
                                    Id: messageData.Id
                                }));

                                console.log(`✅ [${peerId}] Transport connected: ${messageData.Id}`);
                            } catch (error) {
                                console.error(`❌ [${peerId}] Transport connect error:`, error);
                                ws.send(JSON.stringify({ 
                                    error: `Transport connect failed: ${error instanceof Error ? error.message : String(error)}` 
                                }));
                            }
                            break;
                        }

                        case "produce": {
                            if (!currentPeer || !messageData.Id || !messageData.kind || !messageData.rtpParameters) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                return;
                            }

                            const transportData = currentPeer.transports.get(messageData.Id);
                            if (!transportData) {
                                ws.send(JSON.stringify({ error: "Transport not found" }));
                                return;
                            }

                            try {
                                const producer = await transportData.transport.produce({
                                    kind: messageData.kind,
                                    rtpParameters: messageData.rtpParameters,
                                    // Optimize for low latency
                                    appData: { source: messageData.kind }
                                });

                                transportData.producers.set(producer.id, producer);

                                // Broadcast new producer immediately
                                broadcastToRoom(currentPeer.roomId, peerId, {
                                    action: "newProducer",
                                    peerId: peerId,
                                    producerId: producer.id,
                                    kind: producer.kind
                                });

                                ws.send(JSON.stringify({
                                    action: "produced",
                                    producerId: producer.id,
                                    kind: producer.kind
                                }));

                                console.log(`🎥 [${peerId}] Produced ${messageData.kind}: ${producer.id}`);
                            } catch (error) {
                                console.error(`❌ [${peerId}] Produce error:`, error);
                                ws.send(JSON.stringify({ 
                                    error: `Produce failed: ${error instanceof Error ? error.message : String(error)}` 
                                }));
                            }
                            break;
                        }

                        case "consume": {
                            if (!currentPeer || !messageData.Id || !messageData.producerId || !messageData.rtpCapabilities) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                return;
                            }

                            const room = rooms.get(currentPeer.roomId);
                            if (!room) {
                                ws.send(JSON.stringify({ error: "Room not found" }));
                                return;
                            }

                            const transportData = currentPeer.transports.get(messageData.Id);
                            if (!transportData) {
                                ws.send(JSON.stringify({ error: "Transport not found" }));
                                return;
                            }

                            try {
                                // Check if we can consume this producer
                                const canConsume = room.router.canConsume({
                                    producerId: messageData.producerId,
                                    rtpCapabilities: messageData.rtpCapabilities
                                });

                                if (!canConsume) {
                                    ws.send(JSON.stringify({ error: "Cannot consume this producer" }));
                                    return;
                                }

                                // Create consumer with optimized settings
                                const consumer = await transportData.transport.consume({
                                    producerId: messageData.producerId,
                                    rtpCapabilities: messageData.rtpCapabilities,
                                    paused: false, // Start immediately for faster rendering
                                    // Optimize for low latency
                                    appData: { 
                                        source: 'remote',
                                        producerId: messageData.producerId 
                                    }
                                });

                                transportData.consumers.set(consumer.id, consumer);

                                // Send consumed response immediately
                                ws.send(JSON.stringify({
                                    action: "consumed",
                                    consumerId: consumer.id,
                                    producerId: messageData.producerId,
                                    kind: consumer.kind,
                                    rtpParameters: consumer.rtpParameters
                                }));

                                console.log(`📺 [${peerId}] Consumed: ${consumer.id} (${consumer.kind})`);
                            } catch (error) {
                                console.error(`❌ [${peerId}] Consume error:`, error);
                                ws.send(JSON.stringify({ 
                                    error: `Consume failed: ${error instanceof Error ? error.message : String(error)}` 
                                }));
                            }
                            break;
                        }

                        case "closeProducer": {
                            if (!currentPeer || !messageData.producerId) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                return;
                            }

                            let producerClosed = false;
                            currentPeer.transports.forEach(td => {
                                const producer = td.producers.get(messageData.producerId!);
                                if (producer) {
                                    producer.close();
                                    td.producers.delete(messageData.producerId!);
                                    producerClosed = true;
                                }
                            });

                            if (producerClosed) {
                                broadcastToRoom(currentPeer.roomId, peerId, {
                                    action: "producerClosed",
                                    producerId: messageData.producerId,
                                    peerId: peerId
                                });
                            }

                            ws.send(JSON.stringify({
                                action: "producerClosed",
                                producerId: messageData.producerId
                            }));
                            break;
                        }

                        case "closeTransport": {
                            if (!currentPeer || !messageData.Id) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                return;
                            }

                            const transportData = currentPeer.transports.get(messageData.Id);
                            if (transportData) {
                                transportData.producers.forEach(p => p.close());
                                transportData.consumers.forEach(c => c.close());
                                transportData.transport.close();
                                currentPeer.transports.delete(messageData.Id);
                            }

                            ws.send(JSON.stringify({
                                action: "transportClosed",
                                Id: messageData.Id
                            }));
                            break;
                        }

                        case "leave": {
                            if (currentPeer) {
                                cleanupPeer(peerId);
                                currentPeer = null;
                            }
                            ws.send(JSON.stringify({ action: "left" }));
                            break;
                        }

                        default:
                            ws.send(JSON.stringify({ 
                                error: "Unknown action type" 
                            }));
                    }
                } catch (error) {
                    console.error(`❌ [${peerId}] Error:`, error);
                    ws.send(JSON.stringify({ 
                        error: `Error: ${error instanceof Error ? error.message : String(error)}` 
                    }));
                }
            });

            ws.on('close', () => {
                console.log(`🔌 [${peerId}] Connection closed`);
                if (currentPeer) {
                    cleanupPeer(peerId);
                }
            });

            ws.on('error', (error) => {
                console.error(`❌ [${peerId}] WebSocket error:`, error);
            });
        });

        console.log(`✅ Many-to-Many Video Server running on port ${port}`);
    } catch (error) {
        console.error("❌ Failed to start video server:", error);
        throw new UniError(`Failed to start video server: ${error}`);
    }
};

const closeVideoServer = async () => {
    try {
        console.log("🛑 Closing video server...");

        peers.forEach((peer) => {
            cleanupPeer(peer.id);
        });
        
        rooms.clear();
        peers.clear();
        
        wss.close();
        console.log("✅ Video server closed");
    } catch (error) {
        console.error("❌ Error closing video server:", error);
        throw error;
    }
};

export { runVideoServer, closeVideoServer };