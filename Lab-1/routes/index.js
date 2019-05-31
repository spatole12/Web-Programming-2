const appserver = require("./server");

const constructorMethod = app => {
  app.use("/api/tasks", appserver);
  app.use("*", (req, res) => {

    res.sendStatus(404);

  });

};



module.exports = constructorMethod; 