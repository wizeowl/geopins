import React from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `{ me { _id name email picture } }`;

const Login = ({ classes }) => {
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient('http://localhost:4000/graphql', {
      headers: { authorization: idToken }
    });

    const data = await client.request(ME_QUERY);
    console.log(data);
  };

  const onError = error => {
  };

  return <GoogleLogin
    clientId={'344093209540-pod2skf88hbbgr0l57bj1hus6lbi9r8i.apps.googleusercontent.com'}
    onSuccess={onSuccess}
    isSignedIn={true}
    onFailure={error => console.log(error)}
    cookiePolicy={'single_host_origin'}
    uxMode={'popup'}
  />;
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
