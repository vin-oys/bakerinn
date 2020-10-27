import React, { useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import './index.css'

const EditListing = ({ listingInfo, onClose, refreshPage }) => {

    const [item, setItem] = useState(listingInfo.item)
    const [description, setDescription] = useState(listingInfo.description)
    const [price, setPrice] = useState(listingInfo.price)
    const [category, setCategory] = useState(listingInfo.category)
    const [option, setOption] = useState(listingInfo.option)
    const [location, setLocation] = useState(listingInfo.location)
    const [success, setSuccess] = useState(false)

    const priceInput = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setPrice(e.target.value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const listingId = listingInfo._id
        const url = `/api/listings/${listingId}/edit`
        await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ item, description, price, category, option, location })
        })
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
        setSuccess(true)
        setTimeout(() => {
            setSuccess(false);
            onClose();
            refreshPage();
        }, 1000);
    }


    return (
        <div>
            <div className="addListing">
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} style={{ borderStyle: "none" }}>
                        <Form.Label column sm={2}>Item:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                name="item"
                                type="text"
                                value={item}
                                onChange={(e) => { setItem(e.target.value) }}
                                required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{ borderStyle: "none" }}>
                        <Form.Label column sm={2}>Description:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                name="description"
                                as="textarea"
                                value={description}
                                onChange={(e) => { setDescription(e.target.value) }}
                                required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{ borderStyle: "none" }}>
                        <Form.Label column sm={2}>Price:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                name="price"
                                type="text"
                                value={price}
                                onChange={(e) => { priceInput(e) }}
                                required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{ borderStyle: "none" }}>
                        <Form.Label column sm={2}>Category:</Form.Label>
                        <Col sm={10} style={{ display: "flex", justifyContent: "start", justifyItems: "center" }}>
                            <Form.Check
                                inline
                                label="Ingredient"
                                name="category"
                                type="radio"
                                value="ingredient"
                                onChange={(e) => { setCategory(e.target.value) }}
                                required
                                checked={category === "ingredient"} />
                            <Form.Check
                                inline
                                label="Equipment"
                                name="category"
                                type="radio"
                                value="equipment"
                                onChange={(e) => { setCategory(e.target.value) }}
                                required
                                checked={category === "equipment"} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{ borderStyle: "none" }}>
                        <Form.Label column sm={2}>For Loan/Sale:</Form.Label>
                        <Col sm={10} style={{ display: "flex", justifyContent: "start", justifyItems: "center" }}>
                            <Form.Check
                                inline
                                label="For Loan"
                                name="option"
                                type="radio"
                                value="loan"
                                onChange={(e) => { setOption(e.target.value) }}
                                required
                                checked={option === "loan"} />
                            <Form.Check
                                inline
                                label="For Sale"
                                name="option"
                                type="radio"
                                value="sale"
                                onChange={(e) => { setOption(e.target.value) }}
                                required
                                checked={option === "sale"} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{ borderStyle: "none" }}>
                        <Form.Label column sm={2}>Location:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                name="location"
                                as="select"
                                value={location}
                                onChange={(e) => { setLocation(e.target.value) }}
                                required>
                                <option value="">Please select a location</option>
                                <option value="north">North</option>
                                <option value="east">East</option>
                                <option value="south">South</option>
                                <option value="west">West</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Button type="submit" block>Edit Listing</Button>
                    <div style={success
                        ? { visibility: 'visible', color: "green", marginTop: "10px", textAlign: "center" }
                        : { visibility: 'hidden', marginTop: "10px" }} >
                        {`Edited Successfully!`}
                    </div>
                </Form>
            </div >
        </div >
    )
}

export default EditListing;

