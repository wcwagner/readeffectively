import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import principles from '../images/principles-thumbnail.jpg';
import thewalk from '../images/thewalk.jpg'

import {Button, Card, Container, Divider, Grid, Header, Image, Icon, Segment } from 'semantic-ui-react'

class PopularTopics extends Component {

  constructor(props) {
    super(props);
  }

  _make_card(topic) {
    return (
      <Grid.Column width={2}>
        <Card as={Link} to={`/topics/${topic.toLowerCase()}`}>
          <Card.Content>
            <Card.Header style={{'font-size': '1.25em'}} textAlign='center'>
              {topic}
            </Card.Header>
          </Card.Content>
          <Image src={principles}  centered size='small' style={{width: '100%', height: '100%'}}/>
        </Card>
      </Grid.Column>
    );
  }

  render() {
    return (
      <div style={{'margin-below': '-1em'}}>
       <Header as='h3' dividing>
          <Icon name='bullseye' />
          <Header.Content>
            Popular Topics
          </Header.Content>
        </Header>
        <Divider hidden />
        <Grid doubling columns={8} centered>
            {
              this.props.topics.map( (topic, index) =>
                this._make_card(topic)
              )
            }
        </Grid>
      </div>

    );
  }

}


class TrendingBooks extends Component {
  constructor(props) {
    super(props);
    this.NUM_BOOKS = 8
  }

  _make_card() {
    return (
      <Grid.Column width={2}>
        <Card as={Link} to={`/books/1234556789X`}>
          <Image src={thewalk}  centered size='small' style={{width: '100%', height: '100%'}}/>
          <Card.Content>
            <Card.Header style={{'font-size': '1.25em'}} textAlign='center'>
              Some Title
            </Card.Header>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              22 mentions
            </a>
          </Card.Content>
        </Card>
      </Grid.Column>
    );
  }

  render() {
    return (
      <div style={{'margin-top': '2em', 'margin-below': '-1em'}}>
       <Header as='h3' dividing>
          <Icon name='fire' />
          <Header.Content>
            Trending books
          </Header.Content>
        </Header>
        <Divider hidden />
        <Grid doubling columns={8} centered>
            {
              Array(this.NUM_BOOKS).fill().map((_, i) =>
                this._make_card()
              )
            }
        </Grid>
      </div>

    );
  }
}


class CustomReccomendations extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container text style={{marginTop: '3em', marginBottom: '3em'}}>
        <Segment textAlign='center'>
          <Header
            as='h2'
            content='We have reccomendations for you'
            style={{ fontSize: '2em', fontWeight: 'normal', marginBottom: '.3em' }}
          />
          <Button color='orange' size='huge'>
            <Icon name='reddit' />
            Sign in with oAuth2
          </Button>
        </Segment>
      </Container>
    );

  }

}



class Home extends Component {

  POPULAR_TOPICS = ['Cooking', 'Fantasy', 'Business', 'Investing', 'Sci-Fi', 'Romance', 'History', 'Programming']

  render() {
    return (
          <Grid container style={{marginTop: '1em',}}>
            <Grid.Row stretched style={{'backgroundColor': 'white'}}>
              <PopularTopics topics={this.POPULAR_TOPICS} />
            </Grid.Row>
            <Grid.Row stretched>
              <TrendingBooks />
            </Grid.Row>
            <Grid.Row stretched>
              <CustomReccomendations/>
            </Grid.Row>
          </Grid>
    );
  }
}


export default Home;
