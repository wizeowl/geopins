const user = {
  _id: '1',
  name: 'ME HAHAHA',
  email: 'me@me.inc',
  picture: 'https://cloudinary.com/asdsd'
};

module.exports = {
  Query: {
    me: () => user
  }
};
