import React, { Component } from 'react';
// import Button from 'react-bootstrap/Button';
import Pokeball from './Pokeball.svg';
import './App.css';
import HomeContainer from './components/HomeContainer';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
class App extends Component {
  render() {
     return (
        <Router>
           <div className="App">
              <header className="App-header">
                 <img src={Pokeball} className="App-logo" alt="logo" />
                 <h1 className="App-title"> Gotta Catch 'Em All"!!</h1>
                 <Link className="homelink" to="/pokemon/page/0">
                    Pokemon
                 </Link>
                 <Link className="homelink" to="/berries/page/0">
                    Berries
                 </Link>
                 <Link className="homelink" to="/machines/page/0 ">
                    Machines
                 </Link>
              </header>
              <br />
              <br />
              <div className="App-body">
                 <p>Welcome to the PokeDesk</p>
                 <p>Pokémon are Pocket Monsters.<br></br>
          Berries are small fruits that can provide HP and status condition restoration, stat enhancement, and even damage negation when eaten by Pokémon <br></br>
          Machines are the representation of items that teach moves to Pokémon. They vary from version to version, so it is not certain that one specific TM or HM corresponds to a single Machine.
               </p>
                 <Route path="/" component={HomeContainer} />
              </div>
           </div>
        </Router>
     );
  }
}

export default App;
