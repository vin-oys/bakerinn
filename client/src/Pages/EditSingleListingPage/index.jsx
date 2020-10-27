import React, { useState, useEffect } from 'react'
import './index.css'
import EditListing from '../../Components/EditListing'

import { Breadcrumb, Button, Modal } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'

function EditSingleListingPage({ match, refresh }) {
  let history = useHistory();

  useEffect(() => {
    fetchListing()
    // console.log(match)
  }, [])

  const [listing, setListing] = useState({
    owner_info: {}
  })
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const [refresh, setRefresh] = useState(false);

  // const refreshPage = () => setRefresh(true);

  const fetchListing = async () => {
    const listing_id = match.params.id
    const url = `/api/listings/${listing_id}`

    const fetchListing = await fetch(url)

    const listing = await fetchListing.json();

    setListing(listing)
    // console.log(listing)
  }

  const handleDelete = async (e) => {
    e.preventDefault();

    const listingId = listing._id
    const url = `/api/listings/${listingId}/delete`
    await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    })
      // .then((res) => console.log(res))
      .catch((err) => console.log(err))

    setTimeout(() => {
      history.push("/dashboard")
      window.location.reload();
    }, 500)
  }

  const refreshPage = () => {
    window.location.reload();
  }


  return (
    <>
    <Breadcrumb>
      <Breadcrumb.Item as="div" href="#">
        <Link to={`/dashboard`}>dashboard</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item as="div" active>
        {listing.item}
      </Breadcrumb.Item>
    </Breadcrumb>

    <div className="container singleListing" >
      <div className="col">
        <div className="itemImage">
          <img className="image" src="https://cf.shopee.sg/file/2903e156f06c8e301d692e3da8d1ced6" alt="" style={{ width: "350px", borderRadius: "10px" }} />
        </div>
      </div>

      <div className="col">
        <div className="row userInfo">
          <div >
            <img src="https://apprecs.org/gp/images/app-icons/300/41/com.mybox.tothetop.jpg" style={{ width: "100px", height: "100px" }} />
          </div>
          <div className="text-left col user">
            <h4>{listing.owner_info.username}</h4>
            <p>Item location: {listing.location}</p>
          </div>
        </div>
        <div className="text-left itemInfo">
          <h3>{listing.item}</h3>
          <p>Description: {listing.description}</p>
          <p>Price: ${listing.price}</p>
          <p>Category: {listing.category}</p>

          <div className="buttons">
            {/* <Button >Confirm</Button> */}
            <Button variant="primary" onClick={handleShow}>Edit</Button>
            <Modal size="lg" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title >Edit Listing</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <EditListing listingInfo={listing} onClose={handleClose} refreshPage={refreshPage} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
              </Modal.Footer>
            </Modal>
            <Button onClick={(e) => {
              handleDelete(e);
            }}>Delete</Button>
          </div>

        </div>
      </div>
    </div>
    </>
  )
}


export default EditSingleListingPage;


