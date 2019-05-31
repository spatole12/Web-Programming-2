import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';

import {router} from './server.controller';

const app = express();
app.use(cors());
app.use(bodyparser.json());

let currentrequestnumber = 0;
const pathsAccessed = {};
let url_track = {}; 

app.use(function(request: express.Request, response: express.Response, next: express.NextFunction) {
    currentrequestnumber++;
  
    console.log("=============================LOGGER1================================");
    console.log("The total number of requests made : "+currentrequestnumber);
    console.log("=============================LOGGER2================================");
    console.log("Request Body: "+JSON.stringify(request.body));
    console.log("URL path: "+request.protocol+"://"+request.get("host")+request.originalUrl);
    console.log("HTTP verb: "+request.method);
    console.log("=============================LOGGER2================================");
   
    next();
  });

  app.use(function(request: express.Request, response: express.Response, next:express.NextFunction) {
  
    if (url_track[request.protocol+"://"+request.get("host")+request.originalUrl]==undefined) 
    {
      url_track[request.protocol+"://"+request.get("host")+request.originalUrl]=1;
    } 
    else{
      url_track[request.protocol+"://"+request.get("host")+request.originalUrl]++;
    }
  
    console.log("==========================LOGGER3==================================");
    for (var i in url_track){
      console.log("The URL : "+i+"   has total count of:"+ url_track[i]);
    } 
    console.log("==========================LOGGER3==================================");
    next();
  });

app.use("/api/tasks", router);
app.use("*", (req, res) => {
    res.sendStatus(404);
});
app.use(router);
export {app};

