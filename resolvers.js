const { AuthenticationError, PubSub } = require("apollo-server");
const Pin = require("./models/Pin");

const pubsub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be logged in");
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
      const pinAdded = await Pin.populate(newPin, 'author');
      pubsub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (root, { pinId }, { currentUser }) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: pinId, author: currentUser._id }).exec();
      pubsub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (root, { text, pinId }, { currentUser }) => {
      const newComment = { text, author: currentUser._id };
      const pinUpdated = await Pin
        .findOneAndUpdate(
          { _id: pinId },
          { $push: { comments: newComment } },
          { new: true }
        )
        .populate('author')
        .populate('comments.author');
      pubsub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
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
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
    }
  }
};
