import React, { useState, useContext, useEffect } from 'react';
import CuteFood from '../assets/images/cute-food.png';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../services/firebase/index';
import { InputGroup, Form, Button } from 'react-bootstrap';
import CardsComponent from './cards';

let initCardData = {
    roomId: null,
    playerId: null
}

const WelcomeScreen = () => {
    const firebase = useContext(FirebaseContext);
    const [roomcode, setRoomCode] = useState('');
    const [roomExists, setRoomExists] = useState(false);
    const [cards, setCards] = useState([]);
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const [fbData, setFbData] = useState(initCardData);


    useEffect(() => {
    }, [roomExists, fbData.playerId, fbData.roomId]);

    const enterRoom = async () => {
        let res = await firebase.enterRoom(roomcode, { "name": "Chad" });
        if (!res) {
            console.log("room doesn't exists", res);
            setRoomExists(false);
        } else {
            console.log('room exists!');
            setRoomExists(true);
            console.log('returning room contents', res);
            setRoomName(res[`${Object.keys(res)[0]}`]['gameroom']['roomname']);
            const cardObj = res[`${Object.keys(res)[0]}`]['gameroom']['cards'];
            let cards = [];
            setFbData({...fbData, roomId: Object.keys(res)[0], playerId: res.playerId})
            Object.keys(cardObj).map(cardKey => {
                cards.push({ ...cardObj[cardKey] });
            })
            setCards(cards);
            // do something there
        }
    }

    return (
        <div>
            {!roomExists ? (
                <div className="welcome">
                    <h1>Pick Something</h1>
                    <small>Stop bitchin and decide</small>
                    <img src={CuteFood} className="img-fluid" />
                    <Button as={Link} to="/questionaire" variant="primary" size="lg">Create a room!</Button>
                    <h3>OR</h3>
                    <div>
                        <h3>Have room code?</h3>
                        <Form>
                            <Form.Group controlId="formGridAddress1">
                                <Form.Control isInvalid={!roomExists} placeholder="1234" onChange={(e) => setRoomCode(e.target.value)} />
                                <Form.Control.Feedback type="invalid">That room doesn't exist!</Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                        <Button varient="primary" onClick={enterRoom}>Go to room!</Button>
                    </div>
                </div>) : (
                    <div>
                        <h1>Welcome to {roomName}</h1>
                        <CardsComponent cards={cards} data={fbData}/>
                    </div>
                )}
        </div>
    )
}

export default WelcomeScreen;