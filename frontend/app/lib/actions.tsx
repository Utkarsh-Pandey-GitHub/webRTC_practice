"use client"



export async function makeRTCpeerAndOffer(){
    const configuration:RTCConfiguration = {'iceServers':[{'urls':'stun:stun.l.google.com:19302'}]}

    const peerConnection = new RTCPeerConnection(configuration)

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return peerConnection
}

export async function makeRTCpeer(){
    const configuration:RTCConfiguration = {'iceServers':[{'urls':'stun:stun.l.google.com:19302'}]}

    const peerConnection = new RTCPeerConnection(configuration)
    //  answer will be made at the tme of offer arrival

    return peerConnection
}

export async function getVideo({video,audio}:{video:boolean,audio:boolean}) {
    const videoMediaStreams = await navigator.mediaDevices.getUserMedia({video:video,audio:audio})
    return videoMediaStreams
}

export async function getScreenVideo(){
    const screenMediaStreams = await navigator.mediaDevices.getDisplayMedia()
    return screenMediaStreams
}


export async function createOffer(peerConnection:RTCPeerConnection){
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer
}

export async function createAnswer(peerConnection:RTCPeerConnection){
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer
}