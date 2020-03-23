const express = require('express');
const config = require('./config');
var bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || "8000";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Import the library:

// Then use it before your routes are set up:
app.use(cors());

function getUser(req, res) {
    axios.get('https://api.yelp.com/v3/businesses/search', {
        params: {
          latitude: req.body.location.latitude,
          longitude: req.body.location.longitude,
          price: req.body.location.price,
          radius: req.body.location.radius
        },
        headers: {
            Authorization: config.yelp.apikey
        }
      })
      .then(function (response) {
        console.log(response);
        res.status(200).send(response.data);
      })
      .catch(function (error) {
        console.log(error);
        res.status(400).send(error);
      })
      .then(function () {
        // always executed
      });  
}

app.post("/", (req, res) => {
    console.log(req.body);
    getUser(req,res);
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});