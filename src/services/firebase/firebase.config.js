import app from 'firebase/app';
// import 'firebase/auth';
import 'firebase/database';
const config = {
    apiKey: "AIzaSyAxpZZtvsOrCSQWkfmXRSgfOtNYvnpytCc",
    authDomain: "picksomethingalready-5f62f.firebaseapp.com",
    databaseURL: "https://picksomethingalready-5f62f.firebaseio.com",
    projectId: "picksomethingalready-5f62f",
    storageBucket: "picksomethingalready-5f62f.appspot.com",
    messagingSenderId: "408124985406",
    appId: "1:408124985406:web:69e855cef8e5d0f86c816f",
    measurementId: "G-L7W53MZMVY"
};
class Firebase {
    constructor() {
        app.initializeApp(config);
        // this.auth = app.auth();
        this.db = app.database();
        this.date = new Date();
    }
    roomCodeGenerator = () => {
        return Math.floor(1000 + Math.random() * 9000);
    }
    playerIdGenerator = () => {
        return `${this.date.getFullYear()}${this.date.getMonth()}${this.date.getDate()}${this.date.getUTCHours()}${this.date.getUTCMinutes()}${this.date.getUTCSeconds()}`;
    }
    // @param array of bussiness objects, player name
    createGameRoom = (businesses, data) => {
        console.log('creating game room');
        var cards = {};
        const roomCode = this.roomCodeGenerator();
        const playerId = this.playerIdGenerator();
        console.log('businesses to db', businesses);

        for (let business in businesses) {
            console.log(cards[business.id]);
            cards[businesses[business].id] = {
                ...businesses[business]
            }
        }
        console.log('generated cards', cards);

        var results = this.db.ref(`rooms/`).push({
            "roomKey": `${roomCode}`,
            "gameroom": {
                "roomname": data.roomname,
                "cards": {
                    ...cards
                },
                "players": {
                    [playerId]: {
                        "name": data.username
                    }
                },
                "scoreboard": {
                }
            }
        }, function (error) {
            if (error) {
                // The write failed...
                console.log('error', error);
            } else {
                // Data saved successfully!
                console.log('Data saved successfully!');
            }
        });
        console.log('results from room creation', results);
        return { roomCode, playerId, results };
    }



    /*
    *   @params roomcode, data obj 
    *   @return generatedUID and generated room
    */
    enterRoom = async (roomCode, data) => {
        if (!roomCode) {
            return null;
        }
        let playerId = this.playerIdGenerator();
        console.log('Entering room');
        var roomRef = this.db.ref(`rooms/`);
        console.log('room code', roomCode);
        var res = await roomRef.orderByChild('roomKey').equalTo(`${roomCode}`).limitToFirst(1).once('value');
        // returns an obj with the roomCode as it's key
        if (res.val()) {
            console.log('entering roomy test for await', res.val());
            let roomID = Object.keys(res.val())[0];
            console.log('entering room guestId', playerId)
            this.db.ref(`rooms/${roomID}/gameroom/players/${playerId}`).set({ "name": data.name });
            let newData = { ...res.val(), playerId: playerId };
            return newData;
        } else {
            return null;
        }
    }

    updateScoreBoard = async (data) => {
        const scoreboardRef = this.db.ref(`rooms/${data.roomId}/gameroom/scoreboard/${data.restaurantId}`);
        const playersRef = this.db.ref(`rooms/${data.roomId}/gameroom/players`);
        return playersRef.on('value', snap => {
            if (!snap.val()) {
                return null;
            } else {
                let numPlayers = Object.keys(snap.val()).length;
                console.log('num players in update scoreboard', numPlayers);
                scoreboardRef.push({playerId: data.playerId});
                return scoreboardRef.on('value', (snapshot) => {
                    console.log('getting restaurantID score', snapshot.val());

                    if(Object.keys(snapshot.val()).length === numPlayers) {
                        console.log('we agreed on something!');
                        return data.restaurantId
                    }
                })
                console.log('scoreboardUpdated');
            }
        })

    }

    testFirebase = async () => {
        var ansObj = await this.enterRoom("6672");
        if (ansObj !== null) {
            ansObj.then(snap => {
                var roomID = Object.keys(snap.val())[0];
                var roomContent = snap.val();
                console.log('roomcontent', roomContent[roomID]['gameroom']);
            })
        }
    }
}



export default Firebase;