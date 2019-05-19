import React, { Component } from 'react';
import Game from "./components/gameComponent"
import './App.css';

class App extends Component {
  render() {
    return (
      <div id="Main">
        <div id="Header">
          Richard Whale
        </div>
        <div id='Game'>
          <Game/>
        </div>
      </div>
    );
  }
}

export default App;
