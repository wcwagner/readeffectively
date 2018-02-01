import React, { Component } from "react";
import PropTypes from 'prop-types';
import {withRouter, Link} from "react-router-dom";
import axios from 'axios';
import queryString from 'query-string';
import { Container, Item, Icon, Pagination } from 'semantic-ui-react'
import "semantic-ui-css/semantic.css"


const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};


class SearchResultsInfo extends Component {
  // renders the info bar that displays info about book results (e.g. how many hits and which you're viewing)

  render() {
    let { hitsPerPage, numHits, activePage } = this.props;
    let beginIx = (activePage - 1) * hitsPerPage;
    let endIx = Math.min((activePage) * hitsPerPage, numHits);
    return (
      <div style={{flex: '1 1 40px', borderWidth: '0', borderBottomWidth: '1px',  borderColor: 'gray', borderStyle: 'solid'}}>
        {`Showing ${beginIx+1} - ${endIx} of ${numHits} results`}
      </div>
    )
  }
}

class BookList extends Component {
  // Renders the list of Book "cards" on the page
  constructor(props) {
    super(props);
    this.makeCard = this.makeCard.bind(this);
  }

  makeCard(data, key) {
    let {title, thumbnail, ISBN, mentions, score} = data;
    return (
      <Item
        key={key}
        as={Link}
        to={`/book/${ISBN}`}
      >
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
    let { hits } = this.props;
    console.log(hits);
    return (
      <Container style={{marginTop: '2em', marginBottom: '2em'}}>
        <Item.Group divided>
          {Array(hits.length).fill().map((_, i) =>
              this.makeCard(hits[i], i)
          )}
        </Item.Group>
      </Container>
    )
  }
}

class Pageinator extends Component {

}


class Subreddit extends Component {
  static propTypes = {
      match: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    }

  constructor(props) {
    super(props);
    let { location } = this.props;
    let params = queryString.parse(location.search);
    this.state = {
      hits: [],
      activeHits: [],
      activePage: params.page ? params.page : 1,
    }
    this.HITS_PER_PAGE = 12;
    this.getHits = this.getHits.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.getActiveHits = this.getActiveHits.bind(this);
  }

  componentDidMount() {
    this.getHits();
  }

  componentWillReceiveProps(nextProps) {
    let { location } = this.props
    let {location: nextLocation } = nextProps;
    if (location !== nextLocation) {
      let params = queryString.parse(nextLocation.search);
      // if params is empty, it means we are at root /r/:subreddit, so display page 1
      let activePage = params.page ? params.page : 1;
      let activeHits = this.getActiveHits(this.state.hits, activePage);
      this.setState({activePage, activeHits });
    }

  }


  getActiveHits(hits, activePage) {
    let beginIx = (activePage - 1) * this.HITS_PER_PAGE;
    let endIx = (activePage) * this.HITS_PER_PAGE;
    return hits.slice(beginIx, endIx);;
  }

  getHits() {
    axios.get(`http://localhost/api/r/${this.props.match.params.subreddit}`)
    .then((resp) => {
      this.setState({
        hits: resp.data.mentions,
        activeHits: this.getActiveHits(resp.data.mentions, this.state.activePage),
      });
    })
    .catch((err) => {
      console.log(err);
    })
  }

  handlePaginationChange(event, data) {
    let { activePage } = data;
    let { history } = this.props;
    let { subreddit } = this.props.match.params;

    // set active hits, depending on activePage and how many items there are per page
    let activeHits = this.getActiveHits(this.state.hits, activePage);
    this.setState({activePage: activePage,
                   activeHits: activeHits});
    let to = {pathname: `/r/${subreddit}`,
              search: queryString.stringify({page: activePage})};
    history.push(to);
    ScrollToTop();
  }


  render() {
    let { hits, activePage } = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <SearchResultsInfo
          hitsPerPage={this.HITS_PER_PAGE}
          activePage={activePage}
          numHits={hits.length}
        />
        <BookList
          hits={this.state.activeHits}
        />
        <Pagination
          activePage={this.state.activePage}
          totalPages={Math.max(1, Math.ceil(hits.length / this.HITS_PER_PAGE))}
          onPageChange={this.handlePaginationChange}
          style={{alignSelf: 'center', marginTop: '2em', marginBottom: '2em'}}
        />
        }
      </div>
    );
  }
}

export default withRouter(Subreddit);
