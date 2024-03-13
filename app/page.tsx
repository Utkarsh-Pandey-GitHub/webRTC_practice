

"use client"
import { getVideo, getScreenVideo, makeRTCpeerAndOffer, makeRTCpeer, createOffer, createAnswer } from "./lib/actions";

import { useSocket } from "./Provider/SocketProvider";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { log } from "console";
export default function Home() {
  const socket: Socket | null = useSocket()
  const [RTCpeer, setRTCpeer] = useState<RTCPeerConnection>()
  const [share, setShare] = useState({ video: true, audio: false })


  function sendOffer() {
    const offer = createOffer(RTCpeer as RTCPeerConnection).then((offer) => {
      return offer
    }).then((offer) => {
      console.log('OFFER', offer);
      socket?.emit('offer', 'jack', 'jill', offer);
    })
      .catch((err) => {
        console.log(err)
      })
  }

  function sendAnswer() {
    const answer = createAnswer(RTCpeer as RTCPeerConnection).then((answer) => {
      return answer
    }).then((answer) => {
      console.log('ANSWER', answer);
      socket?.emit('answer', 'jack', 'jill', answer);

    })
      .catch((err) => { console.log(err) });


  }
  useEffect(() => {
    if (!RTCpeer) {
      makeRTCpeer().then((peer) => { setRTCpeer(peer) }).catch((err) => { console.log(err) })
    }


  }, [])

  useEffect(() => {


    (socket as any)?.on('offer', (sender: any, reciever: any, offer: RTCSessionDescriptionInit) => {
      console.log('OFFER RECEIVED', offer);
      console.log('RTCpeer', RTCpeer);
      RTCpeer?.setRemoteDescription(offer).then(() => { sendAnswer() }).catch((err) => { console.log(err) });

    });
    (socket as any)?.on('answer', (sender: any, reciever: any, answer: any) => {
      RTCpeer?.setRemoteDescription(answer).then(() => { console.log('ANSWER RECEIVED') });
      (socket as any)?.emit('SDP_complete')
    });
    (socket as any)?.on('SDP_complete', () => {

      console.log('RTCpeerremote', RTCpeer?.remoteDescription);
      console.log('RTCpeerlocal', RTCpeer?.localDescription);
      alert('SDP_EXCHANGED!')
    })
    RTCpeer?.addEventListener('icecandidate', (event: any) => {
      if (event.candidate) {
        (socket as any)?.emit('new-ice-candidate', event.candidate)
      }
    });

    RTCpeer?.addEventListener('connectionstatechange', (event: any) => {
      if (RTCpeer?.connectionState === 'connected') {
        alert("connected!")
      }
    });
    (socket as any).on('new-ice-candidate', (iceCandidate: any) => {
      if (iceCandidate) {
        try {
          RTCpeer?.addIceCandidate(iceCandidate).then(() => { console.log('ICE CANDIDATE ADDED') }).catch((err) => { console.log(err) });
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      }
    });

    return () => {
      (socket as any)?.off('offer');
      (socket as any)?.off('answer');
      (socket as any)?.off('SDP_complete');
      (socket as any)?.off('new-ice-candidate');
      RTCpeer?.removeEventListener('icecandidate', () => { })
      RTCpeer?.removeEventListener('connectionstatechange', () => { })
    }
  }, [RTCpeer])

  useEffect(() => {
    if ((share.video || share.audio) && RTCpeer) {

      getVideo({ video: share.video, audio: share.audio }).then((stream) => {
        const video = document.getElementById('myVideo') as HTMLVideoElement
        video.srcObject = stream
        stream.getTracks().forEach(track => {
          RTCpeer?.addTrack(track, stream);
        })
        return stream
      }).then((stream) => {
        const remoteVideo = document.querySelector('#remoteVideo') as HTMLVideoElement;

        RTCpeer.addEventListener('track', async (event) => {
          const [remoteStream] = event.streams;
          remoteVideo.srcObject = remoteStream;
        });
      })
        .catch((err) => { console.log(err) })
    }
  }, [share, RTCpeer])

  function toggleShare(e: any) {
    setShare({
      ...share,
      [e.target.name]: !share[e.target.name as keyof typeof share]
    })
  }
  return (
    <div className="border border-black m-auto">

      <video id="myVideo" autoPlay width={500} height={500} playsInline controls={true} className=""></video>
      <video id="remoteVideo" autoPlay width={500} height={500} playsInline controls={true} className=""></video>

      <button type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={sendOffer}>Send offer</button>
      <button type="button" className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={toggleShare} name="video">video</button>
      <button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={toggleShare} name="audio">audio</button>
      <button type="button" className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Teal to Lime</button>
      <button type="button" className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Red to Yellow</button>

    </div>
  );
}
