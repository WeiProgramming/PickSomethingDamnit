import React, { useState, useEffect, useContext } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getBusinesses } from '../services/yelp/index';
import CardsComponent from './cards';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { GoogleMap, Circle, LoadScript } from '@react-google-maps/api';

import { FirebaseContext } from '../services/firebase/index';



const SliderWithTooltip = createSliderWithTooltip(Slider);
const style = { margin: 50 };
const initMapOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 300,
    zIndex: 1
}

let initFbData = {
    roomId: null,
    playerId: null
}

let initFormData = {
    username: '',
    roomname: ''
};
const QuestionaireComponent = () => {
    const firebase = useContext(FirebaseContext);
    let [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    let [price, setPrice] = useState('1');
    let [businesses, setBusinesses] = useState({});
    let [radius, setRadius] = useState(1); //miles
    let [mapOptions, setMapOptions] = useState({ ...initMapOptions });
    let [zoom, setZoom] = useState(0);
    let [coordinatesLoaded, setCoordinatesLoaded] = useState(false);
    let [roomCode, setRoomCode] = useState(null);
    let [fbData, setFbData] = useState(initFbData);
    // for username
    let [userData, setUserData] = useState(initFormData);

    useEffect(() => {
        setMapOptions({ ...mapOptions, radius: 1609 * radius });
        setZoom(Math.abs(Math.floor(radius / 7) - 12));
    }, [radius, zoom, roomCode]);
    const radiusFormatter = (miles) => {
        return `${miles} miles`;
    }
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
        setCoordinatesLoaded(!coordinatesLoaded);
        setLocation({ latitude: latitude, longitude: longitude });
    }

    const handleRadioChange = (event) => {
        console.log(event.target.value);
        console.log('setting price');
        setPrice(event.target.value);
    }

    const ifBusinesses = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }

    // Gets business data from the submitted data
    const getPlaces = () => {
        let params = {
            location: location,
            price: price,
            radius: radius
        }
        console.log('clicked');
        getBusinesses(params).then(res => {
            return res.json();
        }).then(res => {
            console.log(res);
            setBusinesses(res);
        });
    };
    const center = {
        lat: location.latitude,
        lng: location.longitude
    }
    const getRadius = (value) => {
        console.log(value); //eslint-disable-line
        setRadius(value);
    }
    const firebaseTest = (fire) => {
        console.log('running fire test');
        fire.testFirebase();
    }

    const createGameRoom = () => { 
        const { roomCode, playerId, results } = firebase.createGameRoom(businesses.businesses, userData);
        console.log('retrieved room code', roomCode);
        // console.log('retrieved results', results.key);
        setRoomCode(roomCode);
        setFbData({...fbData, roomId: results.key, playerId: playerId});
    }
    const updateForm = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }
    return (
                <div>
                    {console.log('is there business?', ifBusinesses(businesses))}
                    {console.log('user form data', userData, roomCode)}
                    {(!!!roomCode) ? (
                        <div className="form-container">
                            {coordinatesLoaded ? (
                                <LoadScript
                                    id="script-loader"
                                    googleMapsApiKey="AIzaSyBkuGkLW-kAdNjXh2ZJQlJM5OKfmc_6Xkk"
                                >
                                    <GoogleMap
                                        id="circle-example"
                                        mapContainerStyle={{
                                            height: "400px"
                                        }}
                                        zoom={zoom}
                                        center={{
                                            lat: location.latitude,
                                            lng: location.longitude
                                        }}>
                                        <Circle
                                            // required
                                            center={center}
                                            // required
                                            options={mapOptions} />
                                    </GoogleMap>
                                </LoadScript>)
                                : (<div>
                                    <h1>We can't find you</h1>
                                </div>)}
                            <form>
                                <Form.Group as={Row}>
                                    <Form.Label as="legend" column xs={12}>
                                        <h3>What's Your Name?</h3>
                                    </Form.Label>
                                    <Form.Control type="text" placeholder="Username" name="username" onChange={(e) => { updateForm(e) }} />
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label as="legend" column xs={12}>
                                        <h3>What's Your Room Name</h3>
                                    </Form.Label>
                                    <Form.Control type="text" name="roomname" placeholder="Room Name" onChange={(e) => { updateForm(e) }} />
                                </Form.Group>
                                <InputGroup className="mb-3">
                                    <Button onClick={getLocation} variant="outline-primary" size="lg" block>Get My Location</Button>
                                </InputGroup>
                                <div style={style}>
                                    <h3>How far? {radius} miles</h3>
                                    <SliderWithTooltip
                                        className='radius-slider'
                                        tipFormatter={radiusFormatter}
                                        tipProps={{ overlayClassName: 'foo' }}
                                        onChange={getRadius}
                                        max={25}
                                        min={1}
                                    />
                                </div>
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
                                        <Col xs={3}>
                                            <Form.Check
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
                            <Button onClick={getPlaces} variant="outline-primary" size="lg" block>Get Businesses</Button>
                            <Button onClick={() => getPlaces()} variant="outline-primary" size="lg" block>Get Test Data and Update the current businesses</Button>
                            <Button onClick={() => createGameRoom()} variant="outline-primary" size="lg" block>Create Game Room</Button>
                            <Button onClick={() => firebaseTest(firebase)} variant="outline-primary" size="lg" block>Test Firebase</Button>
                            <h5>Yay! Your room code is: {roomCode}</h5>
                        </div >) : (
                            <CardsComponent cards={businesses.businesses} total={businesses.total} data={fbData}/>
                        )}

                </div >
    )
}

export default QuestionaireComponent;