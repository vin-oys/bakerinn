import React from 'react'
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import './index.css'
import donut from '../../donut.svg';
import mixer from '../../electric-mixer.svg';

export default function CarouselCard({item}) {
  const img = item.img_public_id || null
  let placeholder = item.category !== 'ingredient' ? mixer : donut
  const style = {
    container: {
      height: "calc(100% - 10px * 2)",
      width: "calc(100% - 10px * 2)",
      margin: "10px",
      backgroundColor: "#e9ecef",
      backgroundImage: (img ? `url(http://res.cloudinary.com/dk0bjhiu9/image/upload/v1/${img})` : `url(${placeholder})`),
      backgroundRepeat: "no-repeat",
      backgroundSize: (img ? "auto 100%" : "auto 50%"),
      backgroundPosition: "center",
      boxShadow: "0.3em 0.3em 0.4em rgba(0,0,0,0.3)",
      borderRadius: 9,
    },
    pop: {
      height: "max-content",
      textAlign: "center",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      borderRadius: "9px 9px 0 0",
      backgroundColor: 'white',
    }
  }
  let history = useHistory()

  const beamMeUp = () => {
    const path = `/homepage/listing/${item._id}`
    history.push(path)
  }

  return (

      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="bottom"
        overlay={
          <Popover id={`popover-positioned-bottom`}>
            <Popover.Title as="h3">{item.category}</Popover.Title>
            <Popover.Content>
              Description: {item.description}
            </Popover.Content>
          </Popover>
        }
      >
        <div onClick={beamMeUp}className="carousel-item-thing"
          style={style.container}>
            <div style={style.pop}>{item.item}</div>
        </div>
      </OverlayTrigger>
  )
}