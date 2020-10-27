import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CarouselCard from '../CarouselCard'
import { ReactComponent as NextIcon } from '../../arrow.svg';

import './index.css'

export default function CarouselV2({ lastestListing = [], interval = null, columns = null, title, headerLink = null }) {
  // make it responsive
  // no hard coded values

  // make breakpoints
  // xs=2
  // md=5
  // l=7


  // get screensize
  let length;
  if (lastestListing) {
    length = lastestListing.length
  } else {
    length = 0
  }
  let interval_ = interval || 5000;


  const [col, setCol] = useState(5)
  const [totalFrames, setTotalFrames] = useState(Math.ceil(length / col))

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      if (entry.contentRect.width < 501) {
        setCol(2)
        setTotalFrames(Math.ceil(length / 2))
      } else if (entry.contentRect.width < 700) {
        setCol(4)
        setTotalFrames(Math.ceil(length / 4))
      } else {
        setCol(6)
        setTotalFrames(Math.ceil(length / 6))
      }
    }
  })

  const refCallback = element => {
    if (element) {
      resizeObserver.observe(element)
    }
  };




  const [slide, setSlide] = useState(0)
  const intervalRef = useRef()

  useEffect(() => {
    startSlide()
    return () => {
      clearInterval(intervalRef.current);
    }
  })

  const startSlide = () => {
    const id = setInterval(() => {
      setSlide(slide < totalFrames - 1 ? slide + 1 : 0)
    }, interval_)
    intervalRef.current = id
  }

  const pauseSlide = () => {
    clearInterval(intervalRef.current)
  }

  const prevSlide = () => {
    clearInterval(intervalRef.current)
    setSlide(slide - 1)
    startSlide()
  }

  const nextSlide = () => {
    clearInterval(intervalRef.current)
    setSlide(slide + 1)
    startSlide()
  }


  let style = {
    carousel: {
      display: "flex",
      position: "relative",
      width: "100%",
      alignItems: "center",
      margin: "0 auto",
      backgroundColor: "white"
    },
    nextRight: {
      textAlign: "center",
      height: "58px",
      width: "58px",
      padding: 10,
      borderRadius: "50%",
      position: "absolute",
      left: -29,
      zIndex: 5,
      transition: "visibility 0.5s ease-in",
      visibility: slide > 0 ? "visible" : "hidden"
    },
    nextLeft: {
      textAlign: "center",
      height: "58px",
      width: "58px",
      padding: 10,
      borderRadius: "50%",
      position: "absolute",
      right: -29,
      zIndex: 5,
      transition: "visibility 0.2s ease-in",
      visibility: slide < totalFrames - 1 ? "visible" : "hidden"
    },
    carouselWrapper: {
      width: "100%",
      overflow: "hidden",
      display: "block",
    },
    carouselBody: {
      height: "100%",
      width: `calc(100% * ${totalFrames})`,
      padding: 0,
      margin: 0,
      display: "flex",
      transition: "transform 0.7s ease-in-out",
      transform: `translateX(-${(slide / totalFrames) * 100}%)`
    },
    carouselItem: {
      width: `calc(100% / ${col} / ${totalFrames})`,
      listStyle: "none",
      paddingTop: `calc(100% / ${col} / ${totalFrames})`,
      position: "relative",
      textAlign: "left",
    },

    // title: {
    //   marginTop: "60px",
    //   padding: "20px",
    //   backgroundColor: "white"
    // }

  }

  return (
    <>
      {headerLink
        ? (<h4 className="carou-title"><Link to={headerLink}><span>{title}</span></Link></h4>)
        : (<h4 className="carou-title"><span>{title}</span></h4>)
      }
      {length
        ? (
          <div ref={refCallback} style={style.carousel}>
            <div onClick={prevSlide}
              className="next"
              style={style.nextRight}>
              <NextIcon transform='rotate(-90)' />
            </div>

            <div onMouseOver={pauseSlide}
              onMouseLeave={startSlide}
              style={style.carouselWrapper}>

              <ul className="carousel-body" style={style.carouselBody}>
                {
                  lastestListing.map((item, index) => (
                    <li key={index} style={style.carouselItem}>
                      <div className="carousel-item-wrapper">
                        <CarouselCard item={item} />
                      </div>
                    </li>
                  ))
                }
              </ul>

            </div>

            <div onClick={nextSlide}
              className="next"
              style={style.nextLeft}>
              <NextIcon transform='rotate(90)' />
            </div>
          </div>
        )
        : (<div className="empty-carousel">
          No listing available
        </div>)
      }
    </>
  )
}

