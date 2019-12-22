import React, { useContext, useState } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import { useClient } from '../../client';
import Context from '../../context';
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations';
import { CREATE_COMMENT } from '../../reducer';

const CreateComment = ({ classes }) => {
  const { state: { currentPin }, dispatch } = useContext(Context);
  const [text, setText] = useState('');
  const client = useClient();

  const submitComment = async () => {
    const variables = { text, pinId: currentPin._id };
    const { createComment } = await client.request(CREATE_COMMENT_MUTATION, variables);
    dispatch({ type: CREATE_COMMENT, payload: createComment });
    setText('');
  };

  return (
    <>
      <form className={classes.form}>
        <IconButton className={classes.clearButton} onClick={() => setText('')} disabled={!text.trim()}>
          <ClearIcon/>
        </IconButton>
        <InputBase
          multiline={true}
          className={classes.input}
          placeholder='Add Comment'
          value={text}
          onChange={({ target: { value } }) => setText(value)}
        />
        <IconButton className={classes.sendButton} onClick={() => submitComment()} disabled={!text.trim()}>
          <SendIcon/>
        </IconButton>
      </form>
      <Divider/>
    </>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
