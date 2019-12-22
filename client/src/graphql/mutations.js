export const CREATE_PIN_MUTATION = `
  mutation($title: String!, $image: String!, $content: String!, $longitude: Float!, $latitude: Float!) {
    createPin(input: {
      title: $title
      image: $image
      content: $content
      longitude: $longitude
      latitude: $latitude
    }) {
      _id
      title
      image
      content
      longitude
      latitude
      author { _id name email picture }
    }
  }
`;

export const DELETE_PIN_MUTATION = `
  mutation($pinId: ID!) {
    deletePin (pinId: $pinId) {
      _id
    }
  }
`;

export const CREATE_COMMENT_MUTATION = `
  mutation($pinId: ID!, $text: String!) {
    createComment(pinId: $pinId, text: $text) {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author { _id name email picture }
      comments {
        text
        createdAt
        author { _id name picture }
      }
    }
  }
`;
