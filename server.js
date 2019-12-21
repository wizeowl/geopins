const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateUser } = require('./controllers/userController');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB connect'))
  .catch(() => console.error('A77lili'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    try {
      const authToken = req.headers.authorization;
      if (authToken) {
        const currentUser = await findOrCreateUser(authToken);
        return { currentUser };
      }
    } catch (error) {
      console.log('Allah Ghaleb. Famma mochkel.', error);
    }

    return null;
  }
});

server.listen().then(({ url }) => {
  console.log('Server listening on', url);
});
