import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import About from './About';
import BookInfo from './BookInfo';
import Home from './Home';
import Subreddit from './Subreddit';
import Topic from './Topic';
import NavBar from './NavBar';


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/r/:subreddit' component={Subreddit}/>
      <Route path='/about' component={About}/>
      <Route path='/book/:isbn' component={BookInfo}/>
      <Route path='/topics/:topic' component={Topic}/>
    </Switch>
  </main>
)

class App extends Component {
    render() {
        return (
            <div className="App">
              <NavBar />
              <Main />
            </div>
        );
    }
}



export default App;
