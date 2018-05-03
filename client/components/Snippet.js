import React from 'react';
import { Card, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

const Snippet = () => (
  <Card>
    <CardText>
      Firepad goes here.
    </CardText>
    <CardActions>
      <RaisedButton
        label="Run Code"
        primary={true}
      />
    </CardActions>
  </Card>
)

export default Snippet;
