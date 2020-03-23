import React, { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {getBusinesses} from '../services/yelp/index';
import CardsComponent from './cards';

const QuestionaireComponent = () => {
    let [location, setLocation] = useState({latitude: 0, longitude: 0});
    let [price, setPrice] = useState('1');
    let [businesses, setBusinesses] = useState({});
    let [radius, setRadius] = useState(25);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    const showPosition = (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        setLocation({ latitude: latitude, longitude: longitude });
    }

    // const handleInputChange = (event) => {
    //     console.log(event.target.value);
    //     console.log('setting location');
    //     setLocation(event.target.value);
    // }

    const handleRadioChange = (event) => {
        console.log(event.target.value);
        console.log('setting price');
        setPrice(event.target.value);
    }

    // Gets business data from the submitted data
    const getPlaces = () => {
        let params = {
            location: location,
            price: price,
            radius: radius
        }
        console.log('clicked');
        getBusinesses(params).then( res => {
            return res.json();
        }).then(res => {
            console.log(res);
            setBusinesses(res);
        })
    };
    return (
        <div>
            <form>
                <InputGroup className="mb-3">
                    {/* <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Zipcode</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="i.e 12345"
                        aria-label="Zipcode"
                        aria-describedby="basic-addon1"
                        onChange={handleInputChange}
                        value={location}
                    /> */}
                    <Button onClick={getLocation} variant="outline-primary" size="lg" block>Get My Location</Button>
                    <Button onClick={getPlaces} variant="outline-primary" size="lg" block>Get Businesses</Button>
                </InputGroup>
                <fieldset>
                    <Form.Group as={Row}>
                        <Form.Label as="legend" column xs={12}>
                            <h3>How Expensive?</h3>
                        </Form.Label>
                        <Col xs={3}>
                            <Form.Check
                                type="radio"
                                label="$"
                                value="1"
                                name="priceRadio"
                                id="price1"
                                onChange={handleRadioChange}
                            />
                        </Col>
                        <Col xs={3}>                            <Form.Check
                            type="radio"
                            label="$$"
                            value="2"
                            name="priceRadio"
                            id="formHorizontalRadios2"
                            onChange={handleRadioChange}
                        /></Col>

                        <Col xs={3}><Form.Check
                            type="radio"
                            label="$$$"
                            value="3"
                            name="priceRadio"
                            id="formHorizontalRadios3"
                            onChange={handleRadioChange}
                        /></Col>

                        <Col xs={3}><Form.Check
                            type="radio"
                            label="$$$$"
                            value="4"
                            name="priceRadio"
                            id="formHorizontalRadios3"
                            onChange={handleRadioChange}
                        /></Col>
                    </Form.Group>
                </fieldset>
            </form>
            <CardsComponent cards={businesses.businesses} total={businesses.total}/>
        </div>
    )
}

export default QuestionaireComponent;