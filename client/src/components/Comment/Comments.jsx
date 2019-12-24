import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const Comments = ({ classes, comments }) => {
  return (
    <List className={classes.root}>
      {
        (comments || []).map((comment, i) => (
          <ListItem key={i} alignItems='flex-start'>
            <ListItemAvatar>
              <Avatar src={comment.author.picture} alt={comment.author.name}/>
            </ListItemAvatar>
            <ListItemText primary={comment.text} secondary={
              <>
                <Typography className={classes.inline} component='span' color={'textPrimary'}>
                  {comment.author.name}
                </Typography>
                . {distanceInWordsToNow(Number(comment.createdAt))} ago
              </>
            }/>
          </ListItem>
        ))
      }
    </List>
  );
};

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
});

export default withStyles(styles)(Comments);
