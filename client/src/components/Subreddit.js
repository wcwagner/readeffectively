import React, { Component } from "react";
import axios from 'axios';
import { Container, Sidebar, Item, Segment, Grid, Button, Menu, Image, Icon, Header, Pagination } from 'semantic-ui-react'
import "semantic-ui-css/semantic.css"

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

class Hits extends Component{

  _make_hit() {
    return (
      <Item>
        <Item.Content>
          <Item.Header as='a'>Header</Item.Header>
          <Item.Meta>Description</Item.Meta>
          <Item.Description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Item.Description>
          <Item.Extra>Additional Details</Item.Extra>
        </Item.Content>
      </Item>
    )
  }
  render() {
    return (
      <Item.Group>
        {
          [...Array(8)].map((e, i) =>
            this._make_hit()
          )
        }
      </Item.Group>
    );
  }
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
    console.log(`http://localhost/api/r/${this.props.match.params.subreddit}`);
    axios.get(`http://localhost/api/r/${this.props.match.params.subreddit}`)
    .then((resp) => { console.log(resp); this.setState({hits: resp.data}); })
    .catch((err) => { console.log(err); })
  }

  makeCard(data, i) {
    let [title, thumbnail, ISBN, mentions, score] = data;
    return (
      <Item key={i}>
        <Item.Image size='tiny' src={thumbnail}/>
        <Item.Content>
          <Item.Header as='a'>{title}</Item.Header>
          <Item.Description>
           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          </Item.Description>
          <Item.Extra as='a'>
            <Icon color='blue' name='comments' /> {mentions} comments
          </Item.Extra>
          <Item.Extra as='a'>
            <Icon color='orange' name='arrow up' /> {score} upvotes
          </Item.Extra>
        </Item.Content>
      </Item>
    )
  }


  render() {
    let { hits } = this.state;
    console.log(hits.length);
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{flex: '1 1 40px', borderWidth: '0', borderBottomWidth: '1px',  borderColor: 'gray', borderStyle: 'solid'}}>
          Showing 1 - 10
        </div>
        <Container style={{marginTop: '2em', marginBottom: '2em'}}>
          <Item.Group divided>
            {Array(hits.length).fill().map((_, i) =>
                this.makeCard(hits[i], i)
              )}
          </Item.Group>
        </Container>
        <Pagination defaultActivePage={5} totalPages={10}
          style={{alignSelf: 'center', marginTop: '2em', marginBottom: '2em'}}/>
      </div>
    );
  }
}

export default Subreddit;
