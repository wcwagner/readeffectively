import React, { Component } from "react";
 import { Container, Header } from 'semantic-ui-react'

class Topic extends Component {
  render() {
    return (
      <Container text>
        <Header> {this.props.match.params.topic} </Header>
      </Container>
    );
  }
}

export default Topic;
