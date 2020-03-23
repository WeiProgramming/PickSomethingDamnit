import React from 'react';
import CuteFood from '../assets/images/cute-food.png';
import Button from 'react-bootstrap/Button';

const WelcomeScreen = () => {
    return (
        <div className="welcome">
            <h1>Pick Something</h1>
            <small>Stop bitchin and decide</small>
            <img src={CuteFood} className="img-fluid"/>
            <Button variant="primary" size="lg">Help Decide!</Button>
        </div>
    )
}

export default WelcomeScreen;