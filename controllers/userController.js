const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  const googleUser = await verifyAuthToken(token);
  const user = await checkIfUserExists(googleUser.email);
  return user || createNewUser(googleUser);
};

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });

    return ticket.getPayload();
  } catch (error) {
    console.log('verifyAuthToken: Allah Ghaleb. Famma mochkel.', error);
  }
};

const checkIfUserExists = async email => await User.findOne({ email }).exec();

const createNewUser = ({ name, email, picture }) => new User({
  name, email, picture
}).save();
