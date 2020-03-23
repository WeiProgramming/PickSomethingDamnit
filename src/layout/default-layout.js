import React from "react";
import WelcomeScreen from '../components/welcome';
import QuestionaireComponent from '../components/questionaire';

const DefaultLayout = () => {
    return (
            <div className="main-layout">
                <div className="container">
                    <WelcomeScreen/>
                    <QuestionaireComponent/>
                </div>
            </div>
    )
}

export default DefaultLayout;