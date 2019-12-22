import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import React, { useContext, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Context from '../../context';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations';
import { DELETE_DRAFT } from '../../reducer';

const CreatePin = ({ classes }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { state: { draft }, dispatch } = useContext(Context);

  const clear = () => {
    setTitle('');
    setImage('');
    setContent('');
  };

  const discardDraft = () => {
    clear();
    dispatch({ type: DELETE_DRAFT });
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'geopins');
    data.append('cloud_name', 'nidhalbt');

    const url = 'https://api.cloudinary.com/v1_1/nidhalbt/image/upload';
    const res = await axios.post(url, data);

    return res.data.url;
  };

  const submit = async event => {
    try {
      setSubmitting(true);
      event.preventDefault();

      const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
      const client = new GraphQLClient('http://localhost:4000/graphql', {
        headers: { authorization: idToken }
      });

      const url = await uploadImage();
      const variables = { title, content, ...draft, image: url };
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables);

      setSubmitting(false);
      discardDraft();
    } catch (error) {
      setSubmitting(false);
      console.log('Allah Ghaleb. Famma mochkel.', error);
    }
  };

  return (
    <form className={classes.form}>
      <Typography className={classes.alignCenter} component='h2' variant={'h4'} color={'secondary'}>
        <LandscapeIcon className={classes.iconLarge}/> Pin Location
      </Typography>
      <div>
        <TextField
          name='title'
          label='title'
          placeholder='Insert pin title'
          onChange={({ target: { value } }) => setTitle(value)}
        />
        <input
          type="file"
          accept='image/*'
          id='image'
          className={classes.input}
          onChange={({ target: { files } }) => setImage(files[0])}
        />
        <label htmlFor='image'>
          <Button
            component='span'
            size={'small'}
            className={classes.button}
            style={{ color: image && 'green' }}
          >
            <AddAPhotoIcon/>
          </Button>
        </label>
      </div>

      <div className={classes.contentField}>
        <TextField
          name='content'
          label='Content'
          multiline
          rows='6'
          margin={'normal'}
          fullWidth
          variant={'outlined'}
          onChange={({ target: { value } }) => setContent(value)}
        />
      </div>

      <div>
        <Button className={classes.button} variant={'contained'} color={'primary'} onClick={discardDraft}>
          <ClearIcon className={classes.leftIcon}/>
          Discard
        </Button>
        <Button
          className={classes.button}
          variant={'contained'}
          color={'secondary'}
          type='submit'
          disabled={!(title.trim() && image && content) || submitting}
          onClick={submit}
        >
          Submit
          <SaveIcon className={classes.rightIcon}/>
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
