import React, { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import PeerService from "../../services/VIdoeCall.service.tsx";

const VideoCall = async () => {
    const ws = new WebSocket("ws://localhost:9020");
    const [sokcetId, SetsocketId] = useState<string>("");
    const [myStream, setMyStream] = useState<MediaStream | string>();
    const hanldeJoin = useCallback(() => {
        SetsocketId(nanoid(10));
    }, [])

    const handleVideo = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await PeerService.getOffer();
        ws.send(JSON.stringify(offer));
        setMyStream(stream)
    }, [])

    useEffect(()=>{
       handleVideo();
    },[]);
    handleVideo();
    return (<>
        <h1>React web Rtc</h1>
        <div>
            <video src={myStream}>{myStream}</video>
            <button onClick={hanldeJoin}>Join Call</button>
        </div>
    </>);
}


export default VideoCall