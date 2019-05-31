import React, { Component } from 'react';
import axios from 'axios';
// import noImage from '../img/download.jpeg';

class Berry extends Component {
   constructor(props) {
      super(props);
      this.state = {
         data: undefined,
         loading: false,
         error:undefined,
      };
   }
   componentWillMount() {
    // console.log("berry !!!");
      this.getBerry();
   }
   async getBerry() {
    //    console.log("berry");
      this.setState({
         loading: true
      });
      try {
        //  console.log(this.props.match.url);
         const response = await axios.get(
            `https://pokeapi.co/api/v2/berry/${this.props.match.params.id}`
         );
        //  console.log(response+"Response");
        if(this.props.match.params.id==="page")throw`No page found`;
         this.setState({
            data: response.data,
            loading: false
         });
        //  console.log(this.state.data);
      } catch (e) {
         console.log(`error ${e}`);
         this.setState({
            loading: false,
            error:`${e}`
         });
      }
   }
   render() {
      let body = null;
      console.log(this.state);
      if (this.state.loading) {
         body = (
            <div>
               <h1>Berry</h1>
               <br />
               Loading...
            </div>
         );
      } else if (this.state.error) {
         body = (
            <div>
               <h1>404 Page Not Found</h1>
            </div>
         );
      } else if(this.state.data) {
         body = (
            <div>
                
               <h3 className="cap-first-letter">
                  {this.state.data && this.state.data.name}
               </h3>
 
               <p>
                  {/* Id: {this.state.data.id} */}
                  <br />
                  Growth Time: {this.state.data.growth_time} <br />
                  Max Harvest: {this.state.data.max_harvest}
                  <br />
                  Natural Gift Power: {this.state.data.natural_gift_power}
                  <br />
                  Size: {this.state.data.size}
                  <br />
               </p>
               
            </div>
         );
      }
      return body;
   }
}

export default Berry;

