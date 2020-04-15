import React from "react";
import WelcomeScreen from '../components/welcome';
import QuestionaireComponent from '../components/questionaire';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const DefaultLayout = () => {
    return (
        <div className="main-layout">
            <Router>
                <div className="container">
                    <Switch>
                        <Route exact path="/">
                            <WelcomeScreen />
                        </Route>
                        <Route exact path="/questionaire">
                            <QuestionaireComponent />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    )
}

export default DefaultLayout;