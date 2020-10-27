import React, { useState } from 'react'
import './index.css'

import { Tab, Tabs, Button, Modal, CardDeck } from "react-bootstrap";
import ListingDetail from '../ListingDetail';
import { Link } from 'react-router-dom';
import AddListing from '../AddListing';

// import AddListingPage from "../../Pages/AddListingPage";


export default function ListingTabs({ user, userId, borrowNo, lendNo, listingNo, borrowing = null, updateParentState }) {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>

      <div>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title >Add Listing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddListing autoClose={handleClose}
              updateParentState={updateParentState}
              userId={userId}
              user={user} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              handleClose();
            }}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Tabs defaultActiveKey="user-listing" transition={false} id="noanim-tab-listing" className="listing-tabs">
        <Tab eventKey="user-listing" title="My listings">
          <div className="add-new-listing-button">
            <Button variant="primary" onClick={handleShow} style={{ width: '200px' }}>Add New Listing</Button>
          </div>

          <div className="listing-selection-box">

            <Link to="/dashboard/available">
              <div className="listing-selection" id="selection-1">
                <h3>See your available listings</h3>
                <p ><span>{listingNo}</span> items</p>
              </div>
            </Link>
            <Link to="/dashboard/loan">
              <div className="listing-selection" id="selection-2">
                <h3>See your loaned listings</h3>
                <p ><span>{lendNo}</span>items</p>
              </div>
            </Link>
          </div>

        </Tab>


        <Tab eventKey="user-borrowed" title="Borrowed">
          <div style={{ display: "flex", justifyContent: "space-between", justifyItems: "center", marginTop: "35px" }}>
            <div>
              <h3>Your borrowed listings</h3>
              <p>Total borrowed listings: {borrowNo}</p>
            </div>
          </div>

          <CardDeck className="container" style={{ display: "flex", justifyContent: "start" }}>
            <ListingDetail allListings={borrowing}
              edit={false} />
          </CardDeck>
        </Tab>
      </Tabs>
    </>
  )
}