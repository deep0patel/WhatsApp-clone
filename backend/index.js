const express = require("express");
const app = express();
const cors = require('cors')
const {
    Buffer
} = require('buffer');
const request = require('request');
const bodyParser = require('body-parser')
const axios = require('axios');

const {
    OAuth2Client
} = require("google-auth-library");

require('dotenv').config();



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const scope = process.env.SCOPE;
const authUrl = new URL("https://accounts.spotify.com/authorize");
const trackIds = [];




// generated in the previous step
app.use(bodyParser.json())
app.use(cors())

app.use(express.json());





app.post('/api/spotifyLogin', async (req, res) => {


    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content_Type': 'application/x-www-form-urlencoded'
        },
        form: {

            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var token = body.access_token;
            res.status(200).json({
                token
            });
        } else {
            res.status(500).json({
                error: 'Failed to retrieve Spotify token'
            });
        }
    });
})

app.get('/api/spotifySearch', async (req, res) => {
    try {

        const queryString = req.query.queryString;
        let token = req.headers.authorization // Extract token from Authorization header
       

        // make authorization header
        const headers = new Headers();
        headers.append("Authorization", "Bearer " + token);


        // make the fetch request
        fetch(queryString, {
                method: "GET",
                headers: headers,
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {

                res.status(200).json(data);
            })
            .catch((error) => {
                console.error("There was a problem with your fetch operation:", error);
            });
    } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
        res.status(500).json({
            error: 'Internal Server Error in backend'
        });
    }
});




app.post('/api/google-login', async (req, res) => {

    const ticket = await client.verifyIdToken({
        idToken: req.body.token,
    })

    res.status(200).json(ticket.getPayload())
})

app.post('/api/test', async (req, res) => {


    res.status(200).json({key:'Test success'})
})


const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log(`Server is ready at http://localhost:${port}`);
});


module.exports = app; 

