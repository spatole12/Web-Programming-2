import React, { Component } from 'react';

class NoSuchRoute extends Component {
    
    render(){
        var body = null;
        body = (
            <div>
               <h1>404 Not Found</h1>
            </div>
         );
         return body;
    }
}

export default NoSuchRoute;