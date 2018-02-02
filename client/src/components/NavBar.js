import React, { Component } from 'react';
import {Container, Form, Header,
        Image, Input, Menu, Responsive } from 'semantic-ui-react';
import amazon from '../images/amazon.svg';

class SearchBar extends Component {

  render() {
    return (
      <Input
        icon='search'
        onChange={this.props.handleSearchChange}
        style={{flex: '8 0 auto', 'borderRadius': 0}}
       />
    );
  }
}


class SubredditSelector extends Component {

  render() {
    return (
      <Input
        defaultValue='all'
        label='r/'
        onChange={this.props.handleSubredditChange}
        style={{flex: '1 1 100px', borderRadius: '0',
                backgroundColor: '#f2f2f2'}}
      />
    )
  }
}


class SubredditSearchBar extends Component {

  handleSubredditChange = (event, { value }) => {
    console.log(value);
    this.setState({subredditValue: value})
  }

  handleSearchChange = (event, { value }) => {
    console.log(value);
    console.log(event.target);
    this.setState({searchValue: value});
  }

  handleSubmit = () => {
    const { subredditValue, searchValue } = this.state;
    console.log(`Submitting ${subredditValue}?q=${searchValue}`);
  }

  render() {
    return (
      <div style={{display: 'flex', width: '100%',}}>
        <Form
          onSubmit={this.handleSubmit}
          unstackable
          style={{flex: '1 0 auto', alignSelf: 'stretch'}}
        >
          <Form.Group inline style={{margin: 0}}>
            <SubredditSelector handleSubredditChange={this.handleSubredditChange} />
            <SearchBar handleSearchChange={this.handleSearchChange}/>
          </Form.Group>
        </Form>
      </div>
    )
  }
}


class DesktopNavBar extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({activeItem: name});

  render() {
    const { activeItem } = this.state;
    return (
        <Menu size='large'
              style={{ 'backgroundColor': '#252F3D', borderRadius: 0, justifyContent: 'center'}}>
          <Container style={{width: '95%'}}>
            <Menu.Item as='a'>
              <Image src={amazon} size='small'/>
            </Menu.Item>

            <Menu.Item style={{flex: '1 1 auto'}}>
              <SubredditSearchBar/>
            </Menu.Item>
            <Menu.Item
              name='About'
              active={activeItem === 'about'}
              onClick={this.handleItemClick}
            >
              <Header inverted size='small'>About</Header>
            </Menu.Item>
            <Menu.Item
              name='sign-in'
              active={activeItem === 'sign-in'}
              onClick={this.handleItemClick}
              style={{'paddingRight': '2em'}}
            >
              <Header inverted size='small'>Sign In</Header>
            </Menu.Item>
          </Container>
        </Menu>
    );
  }
}

class MobileNavBar extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({activeItem: name});

  render() {
    const { activeItem } = this.state;
    return (
        <Menu stackable widths={4} size='large'
              style={{backgroundColor: '#252F3D',
                       borderRadius: 0,
                       justifyContent: 'center',
                       width: '100%'}}>
            <Menu.Item>
              <Image src={amazon} size='small'/>
            </Menu.Item>

            <Menu.Item style={{flex: '1 1 auto'}}>
              <SubredditSearchBar/>
            </Menu.Item>
            <Menu.Item
              name='About'
              active={activeItem === 'about'}
              onClick={this.handleItemClick}
            >
              <Header inverted size='small'>About</Header>
            </Menu.Item>
            <Menu.Item
              name='sign-in'
              active={activeItem === 'sign-in'}
              onClick={this.handleItemClick}
              style={{'paddingRight': '2em'}}
            >
              <Header inverted size='small'>Sign In</Header>
            </Menu.Item>
        </Menu>
    );
  }
}


const NavBar = () => (
  <div>
    <Responsive minWidth={768}>
      <DesktopNavBar/>
    </Responsive>
    <Responsive {...Responsive.onlyMobile}>
      <MobileNavBar/>
    </Responsive>
  </div>
);

export default NavBar;
