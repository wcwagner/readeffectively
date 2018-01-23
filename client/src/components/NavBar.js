import React, { Component } from 'react';
import {Container, Dropdown, Form, Header,
        Image, Input, Menu, Responsive } from 'semantic-ui-react';
import amazon from '../images/amazon.svg';

const subredditOptions = [
  { key: 'all', value: 'all', text: 'r/all'},
]


class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Input
        icon='search'
        style={{flex: '1 0 auto', 'border-radius': 0}}
       />
    );
  }
}

const SubredditSelector = () => (
  <Dropdown
    options={subredditOptions}
    defaultValue='all'
    style={{flex: '0 1 auto', width: 'auto', borderRadius: '0',
            backgroundColor: '#f2f2f2'}}
    search selection fluid

  />
)

const SubredditSearchBar = () => (
  <div style={{display: 'flex', width: '100%'}}>
    <SubredditSelector/>
    <SearchBar/>
  </div>

)

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
