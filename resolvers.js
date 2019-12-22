const { AuthenticationError, PubSub } = require('apollo-server');
const Pin = require('./models/Pin');

const pubsub = new PubSub();
const PIN_ADDED = 'PIN_ADDED';
const PIN_DELETED = 'PIN_DELETED';
const PIN_UPDATED = 'PIN_UPDATED';

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
      pubsub.publish(PIN_ADDED, { pinAdded: pin });
      return pin;
    }),
    deletePin: authenticated(async (root, { pinId }, { currentUser }) => {
      const deletedPin = await Pin.findOneAndDelete({ _id: pinId, author: currentUser._id }).exec();
      pubsub.publish(PIN_DELETED, { pinDeleted: deletedPin });
      return deletedPin;
    }),
    createComment: authenticated(async (root, { text, pinId }, { currentUser }) => {
      const newComment = { text, author: currentUser._id };
      const pin = await Pin
        .findOneAndUpdate(
          { _id: pinId },
          { $push: { comments: newComment } },
          { new: true }
        )
        .populate('author')
        .populate('comments.author');
      pubsub.publish(PIN_UPDATED, { pinUpdated: pin });
      return pin;
    })
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    }
  }
};
