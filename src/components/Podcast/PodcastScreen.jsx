
import React, { Component,useEffect, useState } from 'react';
import Player from './Player';
import Config from 'react-native-config';


export const TRACKS = [
  {
    title: 'otra DEscrip', 
    artist: 'Seguridad desde el hogar',
    albumArtUrl: "https://namiqui-podcast.s3.us-east-2.amazonaws.com/imagenes/imagenPrueba.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20201023T233835Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIATEGE7ZXIEHX2KL7K%2F20201023%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=7af2ea5ed3cc1714ba20a21a6766a8b04c9d0e353e3acacbfb6f0b0ff33485b3",
    audioUrl: "https://namiqui-podcast.s3.us-east-2.amazonaws.com/podcast/podcastPrueba.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20201026T000031Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIATEGE7ZXIEHX2KL7K%2F20201026%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=6d7a6eac971b0fac79098d789d2c7ceb295abd7849a287846244ebedac2aad7d",
  },
  {
    title: 'Episodio 2',
    artist: 'Seguridad desde el trabajo',
    albumArtUrl: "http://arrestedmotion.com/wp-content/uploads/2015/10/JB_Purpose-digital-deluxe-album-cover_lr.jpg",
    audioUrl: 'https://16583.mc.tritondigital.com/LA_CORNETA_LOS40_MEXICO_550_P/media-session/16ddc380-fc24-4b84-ae85-b98305720762/los40mexico/audio/multimedia/20209/28/20200928225355_audio_128.mp3',
  },
  {
    title: 'Hotline Bling',
    artist: 'Drake',
    albumArtUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Drake_-_Hotline_Bling.png',
    audioUrl: 'https://16583.mc.tritondigital.com/LA_CORNETA_LOS40_MEXICO_550_P/media-session/16ddc380-fc24-4b84-ae85-b98305720762/los40mexico/audio/multimedia/20209/28/20200928225355_audio_128.mp3',
  },
];

export default function Podcast(props) {
  const [TRACKSLIST,setTracks]=useState([
    
    {
      cantReprod:0,
      title: 'Hotline Bling',
      artist: 'Drake',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Drake_-_Hotline_Bling.png',
      podcast: 'https://16583.mc.tritondigital.com/LA_CORNETA_LOS40_MEXICO_550_P/media-session/16ddc380-fc24-4b84-ae85-b98305720762/los40mexico/audio/multimedia/20209/28/20200928225355_audio_128.mp3',
    },
  ]);

  useEffect(()=>{

    const myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json');


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    console.log("entre Aqui PAps!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    fetch(`${Config.NAMIQUI_PODCAST}/podcast/getAllPodcast`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
    
      console.log("Valor de la lista");
      console.log(result);
      setTracks(result);
    })
    .catch((error) => {
      console.log('Error al obtener podcast', error);
  });
    ;
  },[]);
  
  return (
    <Player tracks={TRACKSLIST} />


  );
}