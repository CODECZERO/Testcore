import { WebSocketServer, WebSocket } from "ws";
import { UniError } from "../../util/UniErrorHandler.js";
import videoMethode from "./videoMethodes.services.js";
import { nanoid } from "nanoid";
// ============= STATE MANAGEMENT =============
const rooms = new Map();
const peers = new Map();
const performanceMetrics = {
    totalConnections: 0,
    activeConnections: 0,
    totalRooms: 0,
    activeRooms: 0,
    totalTransports: 0,
    totalProducers: 0,
    totalConsumers: 0,
    averageConnectionTime: 0,
    averageVideoLatency: 0,
    errorCount: 0
};
const port = process.env.WEBSOCKETPORTVIDEO ? Number(process.env.WEBSOCKETPORTVIDEO) : 9022;
const wss = new WebSocketServer({ port });
// ============= PERFORMANCE MONITORING =============
function updateMetrics() {
    performanceMetrics.activeConnections = peers.size;
    performanceMetrics.activeRooms = rooms.size;
    let totalTransports = 0;
    let totalProducers = 0;
    let totalConsumers = 0;
    peers.forEach(peer => {
        peer.transports.forEach(transportData => {
            totalTransports++;
            totalProducers += transportData.producers.size;
            totalConsumers += transportData.consumers.size;
        });
    });
    performanceMetrics.totalTransports = totalTransports;
    performanceMetrics.totalProducers = totalProducers;
    performanceMetrics.totalConsumers = totalConsumers;
}
function logPerformance(action, peerId, duration, details) {
    console.log(`📊 [${peerId}] ${action}: ${duration}ms${details ? ` - ${JSON.stringify(details)}` : ''}`);
}
// ============= HELPER FUNCTIONS =============
async function getOrCreateRoom(roomId) {
    const startTime = Date.now();
    let room = rooms.get(roomId);
    if (!room) {
        const router = await videoMethode.startConnection();
        room = {
            id: roomId,
            router,
            peers: new Map(),
            createdAt: Date.now()
        };
        rooms.set(roomId, room);
        performanceMetrics.totalRooms++;
        performanceMetrics.activeRooms++;
        const duration = Date.now() - startTime;
        logPerformance('Room created', roomId, duration);
    }
    return room;
}
function broadcastToRoom(roomId, excludePeerId, message) {
    const room = rooms.get(roomId);
    if (!room)
        return;
    let sentCount = 0;
    room.peers.forEach((peer, peerId) => {
        if (peerId !== excludePeerId && peer.ws.readyState === WebSocket.OPEN) {
            try {
                peer.ws.send(JSON.stringify(message));
                sentCount++;
            }
            catch (error) {
                console.error(`❌ Error broadcasting to peer ${peerId}:`, error);
                performanceMetrics.errorCount++;
            }
        }
    });
    if (sentCount > 0) {
        console.log(`📡 Broadcast to ${sentCount} peers in room ${roomId}`);
    }
}
function cleanupPeer(peerId) {
    const peer = peers.get(peerId);
    if (!peer)
        return;
    const room = rooms.get(peer.roomId);
    const cleanupStart = Date.now();
    // Close all transports, producers, and consumers
    let closedTransports = 0;
    let closedProducers = 0;
    let closedConsumers = 0;
    peer.transports.forEach((transportData) => {
        closedTransports++;
        transportData.producers.forEach(producer => {
            producer.close();
            closedProducers++;
            broadcastToRoom(peer.roomId, peerId, {
                action: "producerClosed",
                producerId: producer.id,
                peerId: peerId
            });
        });
        transportData.consumers.forEach(consumer => {
            consumer.close();
            closedConsumers++;
        });
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
            performanceMetrics.activeRooms--;
        }
    }
    peers.delete(peerId);
    performanceMetrics.activeConnections--;
    const cleanupDuration = Date.now() - cleanupStart;
    logPerformance('Peer cleanup', peerId, cleanupDuration, {
        closedTransports,
        closedProducers,
        closedConsumers
    });
}
// ============= MAIN SERVER =============
const runVideoServer = async () => {
    try {
        console.log('🚀 Starting optimized video server with metrics...');
        wss.on('connection', (ws, req) => {
            const peerId = nanoid(16);
            const connectionStart = Date.now();
            performanceMetrics.totalConnections++;
            performanceMetrics.activeConnections++;
            let currentPeer = null;
            ws.on('message', async (message) => {
                const messageStart = Date.now();
                try {
                    const messageData = JSON.parse(message);
                    console.log(`📨 [${peerId}] ${messageData.actionType}`);
                    switch (messageData.actionType) {
                        case "join": {
                            if (!messageData.roomId) {
                                ws.send(JSON.stringify({ error: "roomId required" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const room = await getOrCreateRoom(messageData.roomId);
                            currentPeer = {
                                id: peerId,
                                ws,
                                roomId: messageData.roomId,
                                transports: new Map(),
                                joinedAt: Date.now(),
                                lastActivity: Date.now()
                            };
                            peers.set(peerId, currentPeer);
                            room.peers.set(peerId, currentPeer);
                            // Get existing producers with performance tracking
                            const existingProducers = [];
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
                                existingProducers,
                                metrics: {
                                    roomPeers: room.peers.size,
                                    totalProducers: existingProducers.length
                                }
                            }));
                            // Broadcast new peer after sending response
                            broadcastToRoom(messageData.roomId, peerId, {
                                action: "newPeer",
                                peerId: peerId
                            });
                            const joinDuration = Date.now() - messageStart;
                            logPerformance('Peer joined', peerId, joinDuration, {
                                roomId: messageData.roomId,
                                existingProducers: existingProducers.length
                            });
                            break;
                        }
                        case "getRouterRtpCapabilities": {
                            if (!currentPeer) {
                                ws.send(JSON.stringify({ error: "Must join room first" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const room = rooms.get(currentPeer.roomId);
                            if (!room) {
                                ws.send(JSON.stringify({ error: "Room not found" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            await videoMethode.getRouterRtpCapabilities(ws, room.router);
                            const duration = Date.now() - messageStart;
                            logPerformance('RTP capabilities sent', peerId, duration);
                            break;
                        }
                        case "createTransport": {
                            if (!currentPeer) {
                                ws.send(JSON.stringify({ error: "Must join room first" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const room = rooms.get(currentPeer.roomId);
                            if (!room) {
                                ws.send(JSON.stringify({ error: "Room not found" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const transportId = nanoid(12);
                            const transport = await videoMethode.createTransportForService(room.router);
                            currentPeer.transports.set(transportId, {
                                transport,
                                producers: new Map(),
                                consumers: new Map(),
                                createdAt: Date.now()
                            });
                            performanceMetrics.totalTransports++;
                            // Optimized transport parameters with STUN servers
                            const transportParams = {
                                id: transport.id,
                                iceParameters: transport.iceParameters,
                                iceCandidates: transport.iceCandidates,
                                dtlsParameters: transport.dtlsParameters,
                                iceServers: [
                                    { urls: 'stun:stun.l.google.com:19302' },
                                    { urls: 'stun:stun1.l.google.com:19302' },
                                    { urls: 'stun:stun2.l.google.com:19302' }
                                ]
                            };
                            ws.send(JSON.stringify({
                                action: "transportCreated",
                                Id: transportId,
                                transportParams
                            }));
                            const duration = Date.now() - messageStart;
                            logPerformance('Transport created', peerId, duration, { transportId });
                            break;
                        }
                        case "connectTransport": {
                            if (!currentPeer || !messageData.Id || !messageData.dtlsParameters) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const transportData = currentPeer.transports.get(messageData.Id);
                            if (!transportData) {
                                ws.send(JSON.stringify({ error: "Transport not found" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            try {
                                await transportData.transport.connect({
                                    dtlsParameters: messageData.dtlsParameters
                                });
                                transportData.connectedAt = Date.now();
                                const connectionTime = transportData.connectedAt - transportData.createdAt;
                                ws.send(JSON.stringify({
                                    action: "transportConnected",
                                    Id: messageData.Id
                                }));
                                const duration = Date.now() - messageStart;
                                logPerformance('Transport connected', peerId, duration, {
                                    transportId: messageData.Id,
                                    connectionTime
                                });
                            }
                            catch (error) {
                                console.error(`❌ [${peerId}] Transport connect error:`, error);
                                performanceMetrics.errorCount++;
                                ws.send(JSON.stringify({
                                    error: `Transport connect failed: ${error instanceof Error ? error.message : String(error)}`
                                }));
                            }
                            break;
                        }
                        case "produce": {
                            if (!currentPeer || !messageData.Id || !messageData.kind || !messageData.rtpParameters) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const transportData = currentPeer.transports.get(messageData.Id);
                            if (!transportData) {
                                ws.send(JSON.stringify({ error: "Transport not found" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            try {
                                const producer = await transportData.transport.produce({
                                    kind: messageData.kind,
                                    rtpParameters: messageData.rtpParameters,
                                    appData: {
                                        source: messageData.kind,
                                        peerId: peerId,
                                        createdAt: Date.now()
                                    }
                                });
                                transportData.producers.set(producer.id, producer);
                                performanceMetrics.totalProducers++;
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
                                const duration = Date.now() - messageStart;
                                logPerformance('Producer created', peerId, duration, {
                                    kind: messageData.kind,
                                    producerId: producer.id
                                });
                            }
                            catch (error) {
                                console.error(`❌ [${peerId}] Produce error:`, error);
                                performanceMetrics.errorCount++;
                                ws.send(JSON.stringify({
                                    error: `Produce failed: ${error instanceof Error ? error.message : String(error)}`
                                }));
                            }
                            break;
                        }
                        case "consume": {
                            if (!currentPeer || !messageData.Id || !messageData.producerId || !messageData.rtpCapabilities) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const room = rooms.get(currentPeer.roomId);
                            if (!room) {
                                ws.send(JSON.stringify({ error: "Room not found" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const transportData = currentPeer.transports.get(messageData.Id);
                            if (!transportData) {
                                ws.send(JSON.stringify({ error: "Transport not found" }));
                                performanceMetrics.errorCount++;
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
                                    performanceMetrics.errorCount++;
                                    return;
                                }
                                // Create consumer with optimized settings
                                const consumer = await transportData.transport.consume({
                                    producerId: messageData.producerId,
                                    rtpCapabilities: messageData.rtpCapabilities,
                                    paused: false, // Start immediately for faster rendering
                                    appData: {
                                        source: 'remote',
                                        producerId: messageData.producerId,
                                        peerId: peerId,
                                        createdAt: Date.now()
                                    }
                                });
                                transportData.consumers.set(consumer.id, consumer);
                                performanceMetrics.totalConsumers++;
                                // Send consumed response immediately
                                ws.send(JSON.stringify({
                                    action: "consumed",
                                    consumerId: consumer.id,
                                    producerId: messageData.producerId,
                                    kind: consumer.kind,
                                    rtpParameters: consumer.rtpParameters
                                }));
                                const duration = Date.now() - messageStart;
                                logPerformance('Consumer created', peerId, duration, {
                                    kind: consumer.kind,
                                    consumerId: consumer.id
                                });
                            }
                            catch (error) {
                                console.error(`❌ [${peerId}] Consume error:`, error);
                                performanceMetrics.errorCount++;
                                ws.send(JSON.stringify({
                                    error: `Consume failed: ${error instanceof Error ? error.message : String(error)}`
                                }));
                            }
                            break;
                        }
                        case "getMetrics": {
                            updateMetrics();
                            ws.send(JSON.stringify({
                                action: "metrics",
                                metrics: performanceMetrics,
                                timestamp: Date.now()
                            }));
                            break;
                        }
                        case "closeProducer": {
                            if (!currentPeer || !messageData.producerId) {
                                ws.send(JSON.stringify({ error: "Invalid parameters" }));
                                performanceMetrics.errorCount++;
                                return;
                            }
                            let producerClosed = false;
                            currentPeer.transports.forEach(td => {
                                const producer = td.producers.get(messageData.producerId);
                                if (producer) {
                                    producer.close();
                                    td.producers.delete(messageData.producerId);
                                    producerClosed = true;
                                    performanceMetrics.totalProducers--;
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
                                performanceMetrics.errorCount++;
                                return;
                            }
                            const transportData = currentPeer.transports.get(messageData.Id);
                            if (transportData) {
                                transportData.producers.forEach(p => {
                                    p.close();
                                    performanceMetrics.totalProducers--;
                                });
                                transportData.consumers.forEach(c => {
                                    c.close();
                                    performanceMetrics.totalConsumers--;
                                });
                                transportData.transport.close();
                                currentPeer.transports.delete(messageData.Id);
                                performanceMetrics.totalTransports--;
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
                            performanceMetrics.errorCount++;
                    }
                }
                catch (error) {
                    console.error(`❌ [${peerId}] Error:`, error);
                    performanceMetrics.errorCount++;
                    ws.send(JSON.stringify({
                        error: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }));
                }
            });
            ws.on('close', () => {
                const connectionDuration = Date.now() - connectionStart;
                logPerformance('Connection closed', peerId, connectionDuration);
                if (currentPeer) {
                    cleanupPeer(peerId);
                }
            });
            ws.on('error', (error) => {
                console.error(`❌ [${peerId}] WebSocket error:`, error);
                performanceMetrics.errorCount++;
            });
        });
        // Performance monitoring interval
        setInterval(() => {
            updateMetrics();
            console.log('📊 Server Metrics:', {
                activeConnections: performanceMetrics.activeConnections,
                activeRooms: performanceMetrics.activeRooms,
                totalTransports: performanceMetrics.totalTransports,
                totalProducers: performanceMetrics.totalProducers,
                totalConsumers: performanceMetrics.totalConsumers,
                errorCount: performanceMetrics.errorCount
            });
        }, 30000); // Log metrics every 30 seconds
        console.log(`✅ Optimized Video Server running on port ${port} with performance monitoring`);
    }
    catch (error) {
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
    }
    catch (error) {
        console.error("❌ Error closing video server:", error);
        throw error;
    }
};
export { runVideoServer, closeVideoServer };
