//$ npm init -y : to initialize package.json.file

// npm i nodemon --save-dev : to make it dev dependency
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    // clientSecret should later be moved to env.file due to security reasons
    clientSecret: process.env.CLIENT_SECRET,
    // https://github.com/thelinmichael/spotify-web-api-node,
    refreshToken,
  });

  // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
      // // Save the access token so that it's used in future calls
      // spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    // clientSecret should later be moved to env.file due to security reasons
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    //for error fix
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

//lyrics
app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) ||
    "No Lyrics Found";
  res.json({ lyrics });
});

app.listen(3001);
