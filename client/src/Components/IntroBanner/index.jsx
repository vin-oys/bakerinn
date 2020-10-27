import React from 'react'
import './index.css'

export default function IntroBanner() {
  return (
    <div className="intro-banner-box" style={{ marginTop: "160px" }}>
      <div className="intro-title" >
        <h3>What We Offer</h3>
      </div>

      <div className="intro-cards-box">
        <div className="intro-cards" >
          Share your extra items
          <div className="intro-cards-image1"></div>
        </div>
        <div className="intro-cards" >
          Looking for something
          <div className="intro-cards-image2"></div>
        </div>
        <div className="intro-cards" >
          Connect with the community
          <div className="intro-cards-image3"></div>
        </div>
      </div>

    </div>
  )
}
