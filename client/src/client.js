import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://nidhal-geopins.herokuapp.com/graphql'
  : 'http://localhost:4000/graphql';

export const useClient = () => {
  const [idToken, setIdToken] = useState('');

  useEffect(() => {
    const token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
    setIdToken(token);
  }, []);

  return new GraphQLClient(BASE_URL, {
    headers: { authorization: idToken }
  });
};
