import React from 'react'
import { Card } from 'react-bootstrap'
import oven from '../../small-oven.svg'
import croisant from '../../croisant.svg'

export default function ListingCard({ listing: { item, description, option, img_public_id, category } }) {
  // console.log("LISTING CARD", props)

  let placeholder = category === "ingredient" ? croisant : oven

  return (
    <>
      <Card style={{ margin: "15px", width: "300px" }}>

        {img_public_id

          ? <dic style={{ height: "300px", 
                          width: "300px",
                          backgroundImage: (img_public_id ? `url(http://res.cloudinary.com/dk0bjhiu9/image/upload/v1/${img_public_id})` : null),
                          backgroundColor: "lightgrey",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "auto 100%",
                          backgroundPosition: "center" }} />

          : <div style={{ height: "280px", 
                          width: "280px", 
                          border: "1px solid lightgrey", 
                          margin: " 10px auto", 
                          display: "flex", 
                          justifyContent: "center", 
                          alignItems: "center",
                          backgroundImage: `url(${placeholder})`,
                          backgroundColor: "#e9ecef",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "auto 50%",
                          backgroundPosition: "center"  }}>
            </div>}

        <Card.Body>
          <Card.Title> <h3>{item}</h3></Card.Title>
          <Card.Text style={{ color: "grey" }}>
            {description}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">For {option}</small>
        </Card.Footer>
      </Card>
    </>
  )
}

