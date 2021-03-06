import React, { useContext } from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { BASE_URL } from '../../client';
import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';
import { IS_AUTH, LOGIN_USER } from '../../reducer';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });

      const { me } = await client.request(ME_QUERY);
      dispatch({ type: LOGIN_USER, payload: me });
      dispatch({ type: IS_AUTH, payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = error => {
    console.log('Allah Ghaleb. Shit Happens', error);
    dispatch({ type: LOGIN_USER, payload: null });
    dispatch({ type: IS_AUTH, payload: false });
  };

  return (
    <div className={classes.root}>
      <Typography
        component='h1' variant='h3' gutterBottom noWrap
        style={{color: 'rgb(66, 133, 244)'}}>
        Welcome
      </Typography>

      <GoogleLogin
        clientId={'344093209540-pod2skf88hbbgr0l57bj1hus6lbi9r8i.apps.googleusercontent.com'}
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        uxMode={'popup'}
        theme={'dark'}
        buttonText='Login with Google'
      />
    </div>
  );
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
