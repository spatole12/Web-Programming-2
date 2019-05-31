const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const configRoutes = require("./routes");

app.use(bodyParser.json());
let currentrequestnumber = 0;
const pathsAccessed = {};
let url_track = {}; 

app.use(function(request, response, next) {
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



app.use(function(request, response, next) {
  
  if (url_track[request.protocol+"://"+request.get("host")+request.originalUrl]==undefined) 
  {
    url_track[request.protocol+"://"+request.get("host")+request.originalUrl]=1;
  } 
  else{
    url_track[request.protocol+"://"+request.get("host")+request.originalUrl]++;
  }

  console.log("==========================LOGGER3==================================");
  for (i in url_track){
    console.log("The URL : "+i+"   has total count of:"+ url_track[i]);
  } 
  console.log("==========================LOGGER3==================================");
  next();
});

configRoutes(app);
app.listen(3000, () => {

    console.log("We've now got a server!");
  
    console.log("Your routes will be running on http://localhost:3000");
  
  });