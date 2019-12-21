import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import Context from './context';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state: { isAuth } } = useContext(Context);
  return (
    <Route
      render={props => !isAuth ? <Redirect to='/login'/> : <Component {...props}/>}
      {...rest}
    />
  );
};

export default ProtectedRoute;