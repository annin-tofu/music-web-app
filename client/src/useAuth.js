import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        //window.history.pushState line: push root url. deletes the random numbers from the end of code
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        //for error fix
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    //I was getting error, since before lines under axios finishes, it was trying to refresh tokens. so
    // below line reads: if we do not have refreshToken or expiresIn, then just want to return. then the error is gone
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          // setRefreshToken(res.data.refreshToken);   {/* these lines are commented out since, to refresh the token, we only needs AccessToken and ExpiresIn variables*/}
          setExpiresIn(res.data.expiresIn);
          // //window.history.pushState line: push root url. deletes the random numbers from the end of code
          // window.history.pushState({}, null, "/");
        })
        .catch(() => {
          //for error fix
          window.location = "/";
        });
      // refreshes 1 minute before expires
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  //   //accessToken expires every 1 hour(3600s), so setting up commannd here to rehresh token automatically
  //   // below line reads: whenever the RefreshToken or ExpiresIn changes, it automatically refreshes the token
  //   useEffect(() => {}, [refreshToken, expiresIn]);
  return accessToken;
}
