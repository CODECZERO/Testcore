import React, { useEffect, useRef, useState } from 'react';
import * as mediasoupClient from 'mediasoup-client';

// Define the TURN server configuration
const ICE_SERVERS = [
    {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
    },
];

// WebSocket server URL
const WS_SERVER_URL = 'ws://localhost:9020';

const App: React.FC = () => {
    // Refs for local and remote video elements
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // States for MediaStreams and signaling
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [device, setDevice] = useState<mediasoupClient.Device | null>(null);
    const [producerTransport, setProducerTransport] = useState<mediasoupClient.types.Transport | null>(null);
    const [consumerTransport, setConsumerTransport] = useState<mediasoupClient.types.Transport | null>(null);

    useEffect(() => {
        // Initialize WebSocket connection
        const initializeSocket = () => {
            const ws = new WebSocket(WS_SERVER_URL);
            setSocket(ws);

            ws.onopen = () => {
                console.log('Connected to WebSocket server');
            };

            ws.onmessage = async (event) => {
                const { action, data } = JSON.parse(event.data);

                switch (action) {
                    case 'producerTransportCreated':
                        await connectProducerTransport(data);
                        break;

                    case 'producerTransportConnected':
                        await produceMedia();
                        break;

                    case 'consumerTransportCreated':
                        await connectConsumerTransport(data);
                        break;

                    case 'consumerCreated':
                        await consumeMedia(data);
                        break;

                    case 'iceCandidate':
                        const candidate = new RTCIceCandidate(data.candidate);
                        if (producerTransport) await producerTransport.addIceCandidate(candidate);
                        break;

                    default:
                        console.error(`Unknown action: ${action}`);
                }
            };
        };

        initializeSocket();
    }, [producerTransport]);

    // Get local stream from media devices
    const getLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    };

    // Create MediaSoup device and transport
    const createMediasoupDevice = async () => {
        const device = new mediasoupClient.Device();
        setDevice(device);
    };

    // Create producer transport
    const createProducerTransport = async () => {
        if (!socket) return;
        createMediasoupDevice();
        socket.send(JSON.stringify({ action: 'createProducerTransport' }));
    };

    // Connect producer transport
    const connectProducerTransport = async (data: any) => {
        if (!device) return;

        const transport = device.createSendTransport(data);

        transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            if (socket) {
                socket.send(JSON.stringify({ action: 'connectProducerTransport', data: { dtlsParameters } }));
                callback();
            } else {
                errback(new Error('Socket not connected'));
            }
        });

        transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
            if (socket) {
                socket.send(JSON.stringify({ action: 'produce', data: { kind, rtpParameters } }));
                callback();
            } else {
                errback(new Error('Socket not connected'));
            }
        });

        setProducerTransport(transport);
    };

    // Produce media (local stream)
    const produceMedia = async () => {
        if (!producerTransport || !localStream) return;

        localStream.getTracks().forEach(async (track) => {
            await producerTransport.produce({
                track: track,
                encodings: [{ maxBitrate: 1000000 }],
                codecOptions: { videoGoogleStartBitrate: 1000 },
            });
        });
    };

    // Create consumer transport
    const createConsumerTransport = async () => {
        if (socket) {
            socket.send(JSON.stringify({ action: 'createConsumerTransport' }));
        }
    };

    // Connect consumer transport
    const connectConsumerTransport = async (data: any) => {
        if (!device) return;

        const transport = device.createRecvTransport(data);

        transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            if (socket) {
                socket.send(JSON.stringify({ action: 'connectConsumerTransport', data: { dtlsParameters } }));
                callback();
            } else {
                errback(new Error('Socket not connected'));
            }
        });

        setConsumerTransport(transport);
  
    };

    // Consume remote media stream
    const consumeMedia = async (data: any) => {
        if (!consumerTransport) return;

        const consumer = await consumerTransport.consume({
            id: data.id,
            producerId: data.producerId,
            kind: data.kind,
            rtpParameters: data.rtpParameters,
        });
        console.log(consumer.rtpParameters);

        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        setRemoteStream(stream);

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
        }

    };

    // Start the call process
    const startCall = async () => {
        await getLocalStream();
        await createProducerTransport();
        await createConsumerTransport();
    };
    

    return (
        <div>
            <h1>MediaSoup Video Call</h1>
            <div>
                <video ref={localVideoRef} autoPlay muted style={{ width: '300px', marginRight: '20px' }} />
                <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
            </div>
            <button onClick={startCall}>Start Call</button>
        </div>
    );
};

export default App;
