class PeerService {
    public peer:RTCPeerConnection
    constructor() {
        if (!this.peer) this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'turn:openrelay.metered.ca:80',
                    username: 'openrelayproject',
                    credential: 'openrelayproject'
                }
            ]
        })
    }

    getOffer=async ()=>{
        if(this.peer){
            const offer=await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }
}

export default new PeerService();