import React from 'react';
import Head from 'next/head';

import getConfig from 'next/config'
import  { useEffect, useRef, useState } from 'react';




function Home() {

  
  
  useEffect(() => {
      
    
    const fetchListaDeRutas = async () => {
     // getListaDeRutas()      
    }
    fetchListaDeRutas()

  }, []); 


  return (
    <React.Fragment>
      <Head>
      </Head>
      <div>
         <h1>Bienvenidos</h1>
      </div>
    </React.Fragment>
  );
};

export default Home
