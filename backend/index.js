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
const client = new OAuth2Client('50416203441-kpni69ojdimi8h3dlpgokkscs9o0avfm.apps.googleusercontent.com')
const spotify_client_id = 'bca5ab5db4964b84a967654e653ba05e'
const spotify_client_secret = '94f5703d04214b21a83f22e8f3b79c78'
const redirectUri = 'http://localhost:5173/';
const scope = 'user-read-private user-read-email';
const authUrl = new URL("https://accounts.spotify.com/authorize")
const trackIds = [];




// generated in the previous step
app.use(bodyParser.json())
app.use(cors())

app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization'); // Add Authorization header
    next();
});




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
                // data.tracks.items.forEach((item, index) => {
                //     const trackId = item.uri.split(":")[2];
                //     trackIds.value.push({
                //         index: index + 1,
                //         trackId: trackId
                //     });
                // })
                // data = data

                res.status(200).json(data);
            })
            .catch((error) => {
                console.error("There was a problem with your fetch operation:", error);
            });

        // const response = await axios.get(queryString, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });
        // res.json(response.data);
        // // console.log(response.data)
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


app.listen(4001, () => {
    console.log(`Server is ready at http://localhost:4001`);
});