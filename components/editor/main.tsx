"use client"

import React, { useCallback, useEffect, useState } from 'react'
import Laptop from './labtop';
import Mobile from './mobile';

const useMediaQuery = (width: number) => {
    const [targetReached, setTargetReached] = useState(false);
  
    const updateTarget = useCallback((e: MediaQueryListEvent) => {
      if (e.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    }, []);
  
    useEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      media.addEventListener("change", updateTarget);
  
      if (media.matches) {
        setTargetReached(true);
      }
  
      return () => media.removeEventListener("change", updateTarget);
    }, []);
  
    return targetReached;
  };
 /* const useMediaQuery = (minWidth:number) => {
    const [state, setState] = useState({
      windowWidth: window.innerWidth,
      isDesiredWidth: false,
    });
  
    useEffect(() => {
      const resizeHandler = () => {
        const currentWindowWidth = window.innerWidth;
        const isDesiredWidth = currentWindowWidth < minWidth;
        setState({ windowWidth: currentWindowWidth, isDesiredWidth });
      };
      window.addEventListener("resize", resizeHandler);
      return () => window.removeEventListener("resize", resizeHandler);
    }, [state.windowWidth]);
    console.log(window.innerWidth)
    return state.isDesiredWidth;
  };*/
export default function Main () {

  const Ismobile = useMediaQuery(1080)
  //window.resizeBy(window.innerWidth,window.innerHeight)
  return (
    <>
    {
      Ismobile?
      <Mobile/>
      :
      <Laptop/>
    }
    </>
  )
}

