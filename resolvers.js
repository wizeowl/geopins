const { AuthenticationError } = require('apollo-server');
const Pin = require('./models/Pin');

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('Who Are You?');
  }

  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: (root, args, ctx) => {
      return Pin.find({}).populate('author').populate('comments.author');
    }
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({ ...args.input, author: ctx.currentUser._id }).save();
      const pin = await Pin.populate(newPin, 'author');
      return pin;
    })
  }
};
