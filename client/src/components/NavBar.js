import React, { Component } from 'react';
import {Container, Dropdown, Form, Header,
        Image, Input, Menu, Responsive } from 'semantic-ui-react';
import amazon from '../images/amazon.svg';

const countryOptions = [
  { key: 'af', value: 'af', flag: 'af', text: 'r/all'},
  { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
  { key: 'al', value: 'al', flag: 'al', text: 'Albania' },
  { key: 'dz', value: 'dz', flag: 'dz', text: 'Algeria' },
  { key: 'as', value: 'as', flag: 'as', text: 'American Samoa' },
  { key: 'ad', value: 'ad', flag: 'ad', text: 'Andorra' },
  { key: 'ao', value: 'ao', flag: 'ao', text: 'Angola' },
  { key: 'ai', value: 'ai', flag: 'ai', text: 'Anguilla' },
]


class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form onSubmit={this.handleFormSubmit}>
      </Form>
    );
  }
}

const SubredditSelector = () => (
  <Dropdown
    placeholder='Select Country'
    options={countryOptions}
    defaultValue='af'
    style={{width: '10em'}}
    search selection fluid

  />
)

class DesktopNavBar extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({activeItem: name});

  render() {
    const { activeItem } = this.state;
    return (
        <Menu stackable size='large' style={{ 'backgroundColor': '#252F3D', borderRadius: 0}}>
          <Container>
            <Menu.Item as='a'>
              <Image src={amazon} size='small'/>
            </Menu.Item>

            <Menu.Item>
              <SubredditSelector/>
            </Menu.Item>

            <Menu.Menu position='right'
            style={{width: '100%', 'borderRightColor': 'rgba(34, 36, 38, 0.15)',
                  'borderRightStyle': 'solid', 'borderRightWidth': '1px'}}>
              <Menu.Item style={{width: '95%'}}>
               <Input icon='search' placeholder='Search...' />
              </Menu.Item>
            </Menu.Menu>
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
        <Menu stackable widths={4}>
          <Container>
            <Menu.Item>
              <Image src={amazon} size='small'/>
            </Menu.Item>

            <Menu.Item>
               <Input placeholder='Search...' />
            </Menu.Item>
            <Menu.Item
              name='about'
              active={activeItem === 'about'}
              onClick={this.handleItemClick}
            >
              About
            </Menu.Item>
            <Menu.Item
              name='sign-in'
              active={activeItem === 'sign-in'}
              onClick={this.handleItemClick}
            />
          </Container>
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
