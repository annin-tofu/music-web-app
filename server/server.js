//$ npm init -y : to initialize package.json.file

// npm i nodemon --save-dev : to make it dev dependency

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log("hi");
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "216d702b08734b7eb253704372f49d9e",
    // clientSecret should later be moved to env.file due to security reasons
    clientSecret: "9bcbd1957c564f0a83c3611326cae26d",
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
    redirectUri: "http://localhost:3000",
    clientId: "216d702b08734b7eb253704372f49d9e",
    // clientSecret should later be moved to env.file due to security reasons
    clientSecret: "9bcbd1957c564f0a83c3611326cae26d",
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

app.listen(3001);
