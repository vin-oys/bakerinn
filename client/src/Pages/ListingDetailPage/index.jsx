import React from 'react'

import { CardDeck, Button, Navbar } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import ListingDetail from '../../Components/ListingDetail'

export default function ListingDetailPage(props) {
  let history = useHistory()
  let { nextpage: next, allListings, edit } = props

  const handleBack = () => {
    history.push("/dashboard")
  }

  const handleNext = () => {
    history.push(`/dashboard/${next}`)
  }

  return (
    <>
      <Navbar bg="light" style={{ display: "flex", justifyContent: "flex-start" }}>
        <Button variant="light" style={{ width: '200px', marginRight: '10px' }} onClick={handleBack}>Back to Dashboard</Button>
        <Button variant="light" style={{ width: '200px' }} onClick={handleNext}>See {next == "loan" ? "Loaned" : "Available"} Listings</Button>
      </Navbar>

      <h3 style={{ textAlign: 'left', margin: '30px' }}>Your {next == "loan" ? "Available" : "Loaned"} Listings</h3>

      <div style={{ height: "550px" }}>
        <CardDeck className="container" style={{ display: "flex", justifyContent: "start" }}>
          {allListings.length > 0 ? <ListingDetail allListings={allListings}
            edit={edit} /> : "No listings to display."}
        </CardDeck>
      </div>

    </>
  )
}