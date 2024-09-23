import React, { useEffect, useState } from 'react'
import '../App.css';



function PlayerCard({ item, player, setPlayer, setCurrNft, currNft, videoSrc, setVideoSrc }) {

  function close() {
    player = false;
    setPlayer(false);
    console.log("close");
    setCurrNft(null);
    currNft = null;
    console.log("player: ", player);
    console.log("curr nft: ", currNft);
    setVideoSrc("")
    console.log("video Src: ", videoSrc);
    
  }
  // const [videoSrc, setVideoSrc] = useState("")
  // useEffect(() => {
  //   console.log(item.image);
  //   const ipfsPrefix = 'https://ipfs.io/ipfs/';
  //   const hash = item.image.substring(ipfsPrefix.length);
  //   const url = "https://cyan-magnetic-rat-616.mypinata.cloud/ipfs/" + hash;
  //   console.log("url: ", url);
  //   setVideoSrc(url);
    
  // })

  return (
    <>
      {console.log("entered playercard")}
      {console.log(item, player, currNft)}
      {player && item && <div>
        <div className='audio-div' style={{ height: "auto", width: "auto" }}>
          <div className='audio-inner p-2'>
            <div className='flex flex-col justify-center items-center'>
              <video width="auto" height="400" controls autoPlay>
                <source src={videoSrc} type="video/ogg" />
                {console.log(videoSrc)}
              </video>
              <h3 className='text-white text-2xl font-thin mt-3'>{item.name}</h3>
              <div className='flex text-white justify-between items-center mb-3 gap-4 mt-3'>
                <button type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2" onClick={() => { close() }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  )
}

export default PlayerCard