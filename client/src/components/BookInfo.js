import React, { Component } from "react";
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import { Container, Comment, Item, Icon, Segment, Rating } from 'semantic-ui-react'


class BookJumbotron extends Component{

  render() {
    console.log('Jumbotron props:', this.props);
    let {title, author, thumbnail, editorialreview} = this.props;
    return (
      <Segment style={{marginTop: '1em'}}>
        <Item.Group>
          <Item>
            <Item.Image
              size='small'
              src={thumbnail}
            />
            <Item.Content>
              <Item.Header as='h1'> {title} </Item.Header>
              <Item.Meta>By {author} </Item.Meta>
              <Item.Meta><Rating icon='star' defaultRating={4} maxRating={5}/></Item.Meta>
              <Item.Description>
                {editorialreview}
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    )
  }
}

function epochToLocalDt(epochUTC){
  console.log(epochUTC);
  let d = new Date(0);
  d.setUTCSeconds(epochUTC);
  return d;
}

class CommentList extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  makeComment(comment, key) {
    let {author, created_utc, subreddit, score, body} = comment;
    return (
      <Comment key={key} style={{borderBottomWidth: '1px', borderColor: 'gray', borderBottomStyle: 'solid'}}>
        <Comment.Content>
          <Comment.Author as='a'> {author}</Comment.Author>
          <Comment.Metadata>
            <div> {epochToLocalDt(created_utc).toString()} </div>
          </Comment.Metadata>
          <Comment.Text>
            <ReactMarkdown source={body} />
          </Comment.Text>
        </Comment.Content>
      </Comment>
    )
  }

  render() {
    let { comments } = this.props;
    console.log(comments);
    return(
      <Comment.Group size='large'>
        {
          Array(comments.length).fill().map((_, i) =>
            this.makeComment(comments[i], i)
          )
        }
      </Comment.Group>
    )
  }
}

class BookInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: {book: {}, comments: []}
    }
  }

  componentDidMount() {
    this.getComments();
  }

  getComments() {
    axios.get(`http://localhost/api/book/${this.props.match.params.isbn}`)
    .then((resp) => {
      console.log(resp);
      this.setState({apiResponse: resp.data.data});
    })
    .catch((err) => {
      console.log(err);
    })
  }

  render() {
    let { book, comments } = this.state.apiResponse;
    return (
      <Container>
        <BookJumbotron
          {...book}
        />
        <CommentList
          comments={comments}
        />
      </Container>


    );
  }
}

export default BookInfo;
