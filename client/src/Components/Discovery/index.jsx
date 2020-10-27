import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import './index.css'

export default function Discovery() {
  const style = {
    hero: {
      backgroundImage: "url('https://images.immediate.co.uk/production/volatile/sites/2/2018/05/Jaffa-cupcakes-0228cdb.jpg?quality=90&crop=18px%2C4249px%2C6155px%2C2648px&resize=960%2C408')",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2em",
      fontWeight: "bold",
      padding: "12px",
      boxShadow: "inset 500px 500px rgba(255,255,255,0.5)",
      height: "400px"
    },
    callToAction1: {
      height: "50%",
      backgroundImage: "url('https://www.tasteofhome.com/wp-content/uploads/2019/03/baking-ingredients_420734245.jpg')",
      backgroundSize: "cover",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.3em",
      fontWeight: "bold"
    },
    callToAction2: {
      height: "50%",
      backgroundImage: "url('https://us.123rf.com/450wm/irinkavasilinka/irinkavasilinka1808/irinkavasilinka180800143/106060907-workplace-confectioner-food-ingredients-and-accessories-for-making-desserts-background-for-text.jpg?ver=6')",
      backgroundSize: "cover",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.3em",
      fontWeight: "bold"
    }
  }

  let history = useHistory();

  const redirect = (path) => {
    history.push(path)
  }

  return (
    <div style={{ marginTop: "160px" }}>
      <Row className="discovery">
        <Col style={style.hero} xs={8}>
          Get adventurous with the <br />
        GREAT SINGAPORE SALE
      </Col>
        <Col xs={4}>
          <div onClick={() => redirect("/homepage/ingredient")}
            className="callToAction"
            style={style.callToAction1}>
            Browse Ingredients
        </div>
          <div onClick={() => redirect("/homepage/equipment")}
            className="callToAction"
            style={style.callToAction2}>
            Browse Equipment
        </div>
        </Col>
      </Row>
    </div>

  )
}