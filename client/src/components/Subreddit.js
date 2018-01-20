import React, { Component } from "react";
import axios from 'axios';
 import { Container, Header } from 'semantic-ui-react'


const hits = [
  {
    title: "A Random Walk down Wall Street: The Time-tested Strategy for Successful Investing",
    author: "Burton G. Malkiel",
    thumbnail: "https://images-na.ssl-images-amazon.com/images/I/51SyHrmTdTL._SX331_BO1,204,203,200_.jpg",
    isbn: "0393352242",
  },
  {
    title: "How We Got to Now: Six Innovations That Made the Modern World Reprint Edition",
    author: "Steven Johnson",
    thumbnail: "https://images-na.ssl-images-amazon.com/images/I/51uJk41nIrL._SX318_BO1,204,203,200_.jpg",
    isbn: "1594633932"
  },
  {
    title: "The Innovator's Solution: Creating and Sustaining Successful Growth",
    author: "Clayton M. Christensen ",
    thumbnail: "https://images-na.ssl-images-amazon.com/images/I/51qWWOy59TL._SX336_BO1,204,203,200_.jpg",
    isbn: "1422196577",
  },
  {
    title: "A Random Walk down Wall Street: The Time-tested Strategy for Successful Investing",
    author: "Burton G. Malkiel",
    thumbnail: "https://images-na.ssl-images-amazon.com/images/I/51SyHrmTdTL._SX331_BO1,204,203,200_.jpg",
    isbn: "0393352242",
  },
  {
    title: "How We Got to Now: Six Innovations That Made the Modern World Reprint Edition",
    author: "Steven Johnson",
    thumbnail: "https://images-na.ssl-images-amazon.com/images/I/51uJk41nIrL._SX318_BO1,204,203,200_.jpg",
    isbn: "1594633932"
  },
  {
    title: "The Innovator's Solution: Creating and Sustaining Successful Growth",
    author: "Clayton M. Christensen ",
    thumbnail: "https://images-na.ssl-images-amazon.com/images/I/51qWWOy59TL._SX336_BO1,204,203,200_.jpg",
    isbn: "1422196577",
  },
];

class Sidebar extends Component {

}

class Subreddit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
    }
  }

  componentDidMount() {
    this.getSubreddit();
  }

  getSubreddit() {
    axios.get('http://localhost:80/api/r/books')
    .then((resp) => { console.log(resp); this.setState({hits: resp}); })
    .catch((err) => { console.log(err); })
  }


  render() {
    return (
      <Container text>
        <Header> {this.props.match.params.subreddit} </Header>
      </Container>
    );
  }
}

export default Subreddit;
