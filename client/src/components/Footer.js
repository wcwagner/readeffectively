import React, { Component } from "react";
import axios from 'axios';
import { Container, Sidebar, Segment, Button, Menu, Image, Icon, Header, Divider, List } from 'semantic-ui-react'
import amazon from '../images/amazon.svg';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment
        inverted
        vertical
        textAlign='center'
        style={{margin: '3em 0em 0em',
                padding: '3.5em 0em',
                backgroundColor: '#252F3D',
                maxHeight: '200px',
              }}
      >
        <Image centered size='small' src={amazon}/>
        <Divider inverted section />
        <List horizontal inverted divided link>
          <List.Item as='a' href='#'>Site Map</List.Item>
          <List.Item as='a' href='#'>Contact Us</List.Item>
          <List.Item as='a' href='#'>Terms and Conditions</List.Item>
          <List.Item as='a' href='#'>Privacy Policy</List.Item>
        </List>
      </Segment>
    );
  }
}

export default Footer;
