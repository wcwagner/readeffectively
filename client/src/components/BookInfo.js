import React, { Component } from "react";
import axios from 'axios';
import { Container, Header } from 'semantic-ui-react'

class BookInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '', author: '', thumbnail: '', isbn: '', comments: ''
    }
  }

  componentDidMount() {
    this.getComments();
  }

  getComments() {
    axios.get(`http://localhost/api/book/${this.props.match.params.isbn}`)
    .then((resp) => {
      this.setState(resp.data);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  render() {
    let {title, author, thumbnail, comments} = this.state;
    return (
      <Container text>
        {title}
        <br/>
        {author}
        <br/>
        {comments}
      </Container>
    );
  }
}

export default BookInfo;
