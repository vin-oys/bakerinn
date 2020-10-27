import React, { useState } from 'react'
import { Form, Row, Col, Button, FormFile } from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import './index.css'

const AddListing = ({autoClose, updateParentState, user, userId}) => {

    const [item, setItem] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [option, setOption] = useState("")
    const [location, setLocation] = useState("")
    const [success, setSuccess] = useState(false)

    const priceInput = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setPrice(e.target.value)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const cloudAPI = "https://api.cloudinary.com/v1_1/dk0bjhiu9/image/upload"

        let formData = new FormData();
        formData.append("file", fileInput);
        formData.append("upload_preset", "project_3")

        fetch(cloudAPI, {
            method: "POST",
            body: formData
        })
          .then(res => res.json())
          .then(res => {
            let img_public_id = res.public_id

            const url = "/api/listings/new"
            fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                                       item, 
                                       description, 
                                       price, 
                                       category, 
                                       option, 
                                       location, 
                                       img_public_id
                                    })
            })
                .then (res => res.json())
                .then(res => {
                    updateParentState({
                        _id: res,
                        category,
                        description,
                        img_public_id,
                        item,
                        location,
                        option,
                        owner_id: userId,
                        owner_info: {
                            username: user
                        },
                        price,
                        state: "available"
                    })
                })
                .catch(err => console.log(err))
          })
          .catch(err => console.log(err))


        setItem("")
        setDescription("")
        setPrice("")
        setLocation("")
        setSuccess(true)
        setFileInput("Select an image")
        setPreviewSrc("")
        setInvalidImg(false)
        setTimeout(() => {
            setSuccess(false);
            autoClose()
        }, 3000);
    }

    const [fileInput, setFileInput] = useState("Select an image")
    const [previewSrc, setPreviewSrc] = useState('')
    const [invalidImg, setInvalidImg] = useState(false)

    const handleFile = (e) => {
        const file = e.target.files[0]
        console.clear();
        console.log(file);
        // over the limit for cloudinary
        if (file.size > 50000000) {
            setInvalidImg(true)
        } else {
            setInvalidImg(false)
            setFileInput(file)
            previewImg(file)
        }
    }

    const previewImg = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSrc(reader.result)
        }
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
                                required />
                            <Form.Check
                                inline
                                label="Equipment"
                                name="category"
                                type="radio"
                                value="equipment"
                                onChange={(e) => { setCategory(e.target.value) }}
                                required />
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
                                required />
                            <Form.Check
                                inline
                                label="For Sale"
                                name="option"
                                type="radio"
                                value="sale"
                                onChange={(e) => { setOption(e.target.value) }}
                                required />
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


                    <Row id="preview-image">
                    </Row>
                    <Form.Group as={Row} style={{ borderStyle: "none" }}>
                        <Col sm={{span:10, offset:1}}>
                        <FormFile custom>
                            <FormFile.Input onChange={handleFile}
                                            isInvalid={invalidImg}
                                            isValid={previewSrc ? true : false}/>
                            <FormFile.Label>{fileInput.name}</FormFile.Label>
                            <Feedback type="invalid">Cannot upload this image</Feedback>
                        </FormFile>
                        <Col xs={{span: 6, offset:3}}>
                            {previewSrc 
                                ? <img 
                                 src={previewSrc}
                                 alt="selected image"
                                 style={{width: "100%",
                                         marginTop: 15}}
                                />
                                : null
                            }
                        </Col>
                        </Col>
                    </Form.Group>


                    <Button type="submit" block>Add Listing</Button>
                    <div style={success
                        ? { visibility: 'visible', color: "green", marginTop: "10px", textAlign: "center" }
                        : { visibility: 'hidden', marginTop: "10px" }} >
                        {`Added Successfully!`}
                    </div>
                </Form>
            </div >
        </div >
    )
}

export default AddListing;

