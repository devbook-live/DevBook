/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';


// this component should render out results of running code.

const Output = ({ output }) => {
  return (
    <Card className="output">
      <h3>Output: </h3>
      <p> {output} </p>

    </Card>
  );
};
export default Output;
