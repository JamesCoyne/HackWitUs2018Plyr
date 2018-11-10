import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import querystring from 'query-string';

class App extends Component {

  constructor(){
    super();
    this.state = {
      data: ''
    };
  }

  componentDidMount(){
    //let accessToken = querystring.parse(window.location.search).access_token;
    let accessToken = querystring.parse(window.location.search).access_token;
    console.log(accessToken);
    console.log(querystring.parse(window.location.search));
    if(accessToken == null){
      console.log('access token is null');
      //prompt the user to login if they haven't already, this needs to be the url of the backend
      //window.location.replace("http://localhost:8888/callback");
    }

    //fetch top tracks
    fetch('https://api.spotify.com/v1/me/top/tracks', {
      method: 'GET',
      headers: {'Authorization' : 'Bearer ' + accessToken}
    })
    .then(response => response.json())
    .then (
      data => {
        console.log(data)
      }
  )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
