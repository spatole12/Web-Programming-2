const path = require("path");

// All other routes will load a 404 page.
const constructorMethod = app => {

app.get("/", (req, res) =>   {
  res.sendFile(path.resolve("./static/products.html"));
});



  app.use("*", (req, res) => {
    
    res.sendFile(path.resolve("./static/error.html"));

  });

};


module.exports = constructorMethod;