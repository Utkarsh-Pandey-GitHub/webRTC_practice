

"use client"
import { getVideo, getScreenVideo, makeRTCpeerAndOffer, makeRTCpeer, createOffer, createAnswer } from "./lib/actions";

import { useSocket } from "../Provider/SocketProvider";
import { Socket } from "socket.io-client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { log } from "console";
import ChatDialog from '../components/myComponents/ChatDialog'
import Draggable from "react-draggable";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"



export default function Home() {
  const { socket, configuration }: any = useSocket()
  const [RTCpeer, setRTCpeer] = useState<RTCPeerConnection | any>()
  useEffect(() => {
    const RTCPeer: RTCPeerConnection = new RTCPeerConnection(configuration)
    setRTCpeer(RTCPeer)
  }, [])
  // const [RTCpeer, setRTCpeer] = useState<RTCPeerConnection>()
  console.log(RTCpeer);

  const [share, setShare] = useState<{ video: boolean, audio: boolean }>({ video: true, audio: false })
  const [clicked, setClicked] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>()
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>()
  const vid = useRef<HTMLVideoElement | null>(null)

  const handleClick = () => {
    setClicked(prev => !prev);
  };


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


    (socket as any)?.on('offer', (sender: any, reciever: any, offer: RTCSessionDescriptionInit) => {
      console.log('OFFER RECEIVED', offer);
      console.log('RTCpeer', RTCpeer);
      RTCpeer?.setRemoteDescription(offer).then(() => { sendAnswer() }).catch((err: any) => { console.log(err) });

    });
    (socket as any)?.on('answer', (sender: any, reciever: any, answer: any) => {
      RTCpeer?.setRemoteDescription(answer).then(() => { console.log('ANSWER RECEIVED') });
      (socket as any)?.emit('SDP_complete')
    });
    (socket as any)?.on('SDP_complete', () => {

      console.log('RTCpeerremote', RTCpeer?.remoteDescription);
      console.log('RTCpeerlocal', RTCpeer?.localDescription);
      alert('SDP_EXCHANGED!')
    });
    (socket as any).on('new-ice-candidate', (iceCandidate: any) => {
      if (iceCandidate) {
        try {
          RTCpeer?.addIceCandidate(iceCandidate).then(() => { console.log('ICE CANDIDATE ADDED') }).catch((err: any) => { console.log(err) });
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      }
    });
    socket.on('toggle', (share: any) => {
      toggleRemote(share);
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
    const remoteVideo = document.querySelector('#remoteVideo') as HTMLVideoElement;
    RTCpeer?.addEventListener('track', async (event: any) => {
      const [remoteStream] = event.streams;
      remoteVideo.srcObject = remoteStream;
      setRemoteStream(remoteStream);

    });


    return () => {
      (socket as any)?.off('offer');
      (socket as any)?.off('answer');
      (socket as any)?.off('SDP_complete');
      (socket as any)?.off('new-ice-candidate');
      RTCpeer?.removeEventListener('icecandidate', () => { })
      RTCpeer?.removeEventListener('connectionstatechange', () => { })
      RTCpeer?.removeEventListener('track', () => { })
    }
  }, [RTCpeer])

  function sendTrack() {
    const video = document.getElementById('myVideo') as HTMLVideoElement
    const stream = video.srcObject as any;
    // setLocalStream(stream);
    (stream as any)?.getTracks().forEach((track: any) => {
      RTCpeer?.addTrack(track, stream);
    })
  }
  function stopSendingTrack() {
    if (localStream) {
      console.log("localStream", localStream);

      // (localStream as any).getVideoTracks()[0].enabled = false;
      // (localStream as any).getAudioTracks()[0].enabled = false;
    }
  }
  function toggleTrack() {
    if (localStream) {

      const track = (localStream as any).getVideoTracks()[0];
      if (track) {

        (track as MediaStreamTrack).enabled = share.video;
      }
      const trackA = (localStream as any).getAudioTracks()[0];
      if (trackA) {

        (trackA as MediaStreamTrack).enabled = share.audio;
      }
    }
  }
  function toggleRemote(config: any) {
    if (remoteStream) {

      const track = (remoteStream as any).getVideoTracks()[0];
      if (track) {

        (track as MediaStreamTrack).enabled = config.video;
      }
      const trackA = (remoteStream as any).getAudioTracks()[0];
      if (trackA) {

        (trackA as MediaStreamTrack).enabled = config.audio;
      }
    }
  }
  function setPreviewTrack() {
    if ((share.video || share.audio) && RTCpeer) {

      getVideo({ video: share.video, audio: share.audio })
        .then((stream) => {
          const video = document.getElementById('myVideo') as HTMLVideoElement
          video.srcObject = stream
          return stream
        })
        .then((stream) => setLocalStream(stream as any))
        .then(() => { sendTrack() })
        .catch((err: any) => { console.log(err) })
    }
  }
  useEffect(() => {
    setPreviewTrack();
    toggleTrack();
  }, [share]);

  function toggleShare(e: any) {
    setShare({
      ...share,
      [e.target.name]: !share[e.target.name as keyof typeof share]
    })
    socket?.emit('toggle', share)
  }
  return (
    <div className="border border-black  h-screen w-screen">

      <div className="absolute bottom-0 flex flex-col  w-fit" >

        <video id="myVideo" autoPlay playsInline controls={false} className="h-44 rounded-3xl w-full" ></video>
        <div className="z-30">
          <button type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={sendOffer}>
            Send offer
          </button>
          <button type="button" className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={toggleShare} name="video">
            video
          </button>
          <button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={toggleShare} name="audio">
            audio
          </button>
          <button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={stopSendingTrack} name="audio">
            disconnect
          </button>
          <button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={sendTrack} name="audio">
            send again
          </button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel >
          <video id="remoteVideo" autoPlay playsInline controls={false} className=" w-screen h-screen  "></video>
        </ResizablePanel>
        <ResizableHandle withHandle />


        <div
          className={`group flex h-20 w-20 cursor-pointer items-center justify-center rounded-3xl  p-2 ${clicked ? 'bg-transparent' : ''} absolute right-0`}
          onClick={handleClick}
        >
          <div className="space-y-2">
            <span className={`block h-1 w-10 origin-center rounded-full bg-slate-500 transition-transform ease-in-out ${clicked ? 'translate-y-1.5 rotate-45' : ''}`}></span>
            <span className={`block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out ${clicked ? 'w-10 -translate-y-1.5 -rotate-45 scale-x-125' : ''}`}></span>
          </div>
        </div>
        {clicked && <ResizablePanel defaultSize={25}>
          <div>
            {clicked && <ChatDialog />}
          </div>
        </ResizablePanel>}
      </ResizablePanelGroup>

    </div>
  )
}

