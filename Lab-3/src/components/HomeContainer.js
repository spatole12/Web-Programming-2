import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PokemonList from './PokemonList';
import BerryList from './BerryList';
import MachineList from './MachineList'
import Pokemon from './Pokemons';
import Berry from './Berries';
import Machine from './Machines'
import NoSuchRoute from './NoSuchRoute'

class HomeContainer extends Component {
   render() {
      return (
         <div>
            <Switch>
               <Route path="/pokemon/page/:page" exact component={PokemonList} />
               <Route path="/pokemon/:id" exact component={Pokemon} />
               <Route path="/berries/page/:page" exact component={BerryList} />
               <Route path="/berries/:id" exact component={Berry} />
               <Route path="/machines/page/:page" exact component={MachineList} />
               <Route path="/machines/:id" exact component={Machine} />
               <Route path="" exact component={NoSuchRoute} />
               {/* <Route path="/pokemon/page/:page" exact component={Pokemon} /> */}

            </Switch>
         </div>
      );
   }
}

export default HomeContainer;