import React from 'react'

import { Carousel as BCarousel } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import './index.css'

export default function Carousel(props) {
  let { title, lastestListing=null, headerLink=null} = props;

  return (
    <>
      {headerLink
        ? (<Link to={headerLink}><h4>{ title }</h4></Link>)
        : (<h4>{ title }</h4>)
      }
      {lastestListing
        ? ( <BCarousel className="border carousel-container"
                       pause="hover">
              {/* 
                  LINK NEEDS TO BE UPDATED TO USE ITEM unique ID 
                  The click on card needs to redone
                  Redo the carousel if time permits to show multiple cards
              */}
              {lastestListing.map((item, index) => {
                return (
                  <BCarousel.Item key={index}>
                    <Link to={`/homepage/listing/${item._id}`}>
                      <div>
                        Placeholder
                      <BCarousel.Caption>
                      <p>Name: {item.name}</p>
                      <p>Description: {item.description}</p>
                      </BCarousel.Caption>
                      </div>
                    </Link>  
                  </BCarousel.Item>
                )
              })}
            </BCarousel>
          )
        : (<div className="empty-carousel">
             No listing available
           </div>)
      }
    </>
  )
}



