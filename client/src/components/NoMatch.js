import React, { Component } from 'react';
import {Container, Header, Segment } from 'semantic-ui-react';


class NoMatch extends Component {
  render() {
    return (
      <Container text style={{marginTop: '3em', marginBottom: '3em'}}>
        <Segment textAlign='center'>
          <Header
            as='h2'
            content='Page not found'
            style={{ fontSize: '2em', fontWeight: 'normal', marginBottom: '.3em' }}
          />
        </Segment>
      </Container>
    )
  }
}

export default NoMatch;
