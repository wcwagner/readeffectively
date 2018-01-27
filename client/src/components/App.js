import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import About from './About';
import BookInfo from './BookInfo';
import Home from './Home';
import Subreddit from './Subreddit';
import Topic from './Topic';
import NavBar from './NavBar';
import Footer from './Footer';
import NoMatch from './NoMatch';

const DefaultLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <div style={{flex: '1 0 auto'}}>
          <NavBar/>
        </div>
        <div style={{flex: '1 1 900px'}}>
          <Component {...matchProps} />
        </div>
        <div style={{flex: '1 0 150px'}}>
          <Footer/>
        </div>
      </div>
    )} />
  )
};


class App extends Component {
  render() {
    return (
      <Switch>
        <DefaultLayout exact path='/' component={Home}/>
        <DefaultLayout path='/r/:subreddit' component={Subreddit}/>
        <DefaultLayout path='/about' component={About}/>
        <DefaultLayout path='/book/:isbn' component={BookInfo}/>
        <DefaultLayout path='/topics/:topic' component={Topic}/>
        <DefaultLayout component={NoMatch}/>
      </Switch>
    );
  }
}

export default App;
