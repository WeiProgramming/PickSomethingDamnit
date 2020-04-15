import React, { useState, useEffect, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
// import { TinderLikeCard } from 'react-stack-cards';
import Button from 'react-bootstrap/Button';
import { IoIosHeart, IoMdClose } from 'react-icons/io';
import { FirebaseContext } from '../services/firebase/index';
import TinderCard from 'react-tinder-card/index';


let initData = {
    roomId: null,
    playerId: null,
    restaurantId: null
}

const CardsComponent = (props) => {
    const firebase = useContext(FirebaseContext);
    let [cardDirection, setCardDirection] = useState(null);
    let [fbData, setFbData] = useState(initData);
    const [lastDirection, setLastDirection] = useState()

    useEffect(() => {
        let results = firebase.updateScoreBoard(fbData);
        console.log('results from udpate scoreboard', results);
        results.then(res => console.log('results from udpate scoreboard', res))
    }, [fbData.roomId, fbData.playerId, fbData.restaurantId]);
    useEffect(() => {

    }, [cardDirection]);
    const swiped = (direction, nameToDelete) => {
        console.log('removing: ' + nameToDelete)
        console.log('direction of swipe', direction);
        setLastDirection(direction)
        if(direction === 'right') {
            console.log('swiped right saving', nameToDelete);
            setFbData({...fbData, restaurantId: nameToDelete, roomId: props.data.roomId, playerId: props.data.playerId});
        }
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }
    return (
        <Container className="card-container">
            {console.log('rendering cards', props.cards)}
            {props.cards ? (
                props.cards.map((card,i) => {
                    return (
                        <TinderCard className='swipe' key={card.id} onSwipe={(dir) => swiped(dir, card.id)} onCardLeftScreen={() => outOfFrame(card.id)}>
                            <div className='card' style={(i % 2 === 0 ? {'transform': 'rotate(2deg)'}:{'transform': 'rotate(-2deg)'})}>
                                <h4>{card.name}</h4>
                                <p>Price {card.price}</p>
                                <p>Phone {card.display_phone}</p>
                                <p>Ratings {card.rating}</p>
                                <p>{card.distance/1609} mi.</p>
                                <p><a href={card.url} target="_blank">Visit Site</a></p>
                            </div>
                        </TinderCard>)
                })
            ) : <div>Not Loaded</div>}
        </Container >
    )
}

export default CardsComponent;