import { useRef, useState } from 'react'
import VideoPlayer from './VideoPlayer'
import './App.css'
import videojs from 'video.js';

function App() {
  const videoPlayerref = useRef(null);
  const video_liink = `http://localhost:8000/uploads/courses/064822c0-0c7c-45d3-a211-a784c979dd8b/index.m3u8`;
  
  const VideoPlayerOptions = {
    controls : true,
    responsive : true,
    fluid : true,
    sources : [
      {
        src: video_liink,
        type : "application/x-mpegURL"
      }
    ]
  }

  const handlePlayerReady = (player) => {
    videoPlayerref.current = player;

    player.on("waiting" , () => {
      videojs.log(" player is waitung")
    })

    player.on("dispose" , () => {
      videojs.log(" player is disposed")
    })

  }

  
  return (
    <>
    <div>
      <h1>
        Video Player
      </h1>
    </div>
    <VideoPlayer 
    options = {VideoPlayerOptions}
    onReady = {handlePlayerReady}
    />
    </>  
  )
}

export default App
