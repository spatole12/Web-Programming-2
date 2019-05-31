const express = require("express");
const router = express.Router();
const data = require("../data");
const serverData = data.server;
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });

router.get('/',async(req,res)=>{
  try{
        let obj = req.query;
        let tasks = await serverData.getTasks(obj);
        res.json(tasks);
      }
      catch(e)
      {
          res.status(404).json({error:"Task not found!"})
      }   
});

router.get('/:id',async(req,res)=>{
    try{
       const task = await serverData.getTaskById(req.params.id);
       if(task == undefined || (!task))throw"The  task is not found !! "
       res.json(task);
    }
    catch(e)
    {
        res.status(404).json({error:"Task not found!"})
    }
});

router.post("/", urlencodedParser,async (req, res) => {
  try {  
  const taskData = req.body;
    if(taskData == undefined || !(taskData))throw "The request body is not complete !! "
    
      const { title,description,hoursEstimated,completed,comments } = taskData;
      const newTask = await serverData.addTask(title,description,hoursEstimated,completed,comments);
      if(newTask == undefined || (!newTask))throw "The new task is not created!! "
      res.json(newTask);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const updatedData = req.body;
      if(req.params.id == undefined || (!req.params.id)) throw "The id is not retrieved !!  "
      if(updatedData == undefined || (!updatedData))throw "The task is not retrieved !! "
      if(!updatedData.title) throw "Please provide a title"
      if(!updatedData.description) throw "Please provide a description"
      if(!updatedData.hoursEstimated) throw "Please provide hoursEstimated "
      if(!updatedData.completed) throw "Please provide a completed"
      if(!updatedData.comments) throw "Please provide a comments"
      const updatedTask = await serverData.updateTask(req.params.id, updatedData);
      if(updatedTask == undefined || (!updatedTask)) throw "The updated task is not found !! "
      res.json(updatedTask);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.patch('/:id', async (req, res)=> {
    try{
    const updatedData = req.body;
    if(updatedData == undefined || (!updatedData))throw "The task is not retrieved !! "
    const id = req.params.id;
    if(id == undefined || (!id)) { res.json("The id is not retrieved !!  ")}
    const updatedTask = await serverData.update_patchTask(id,updatedData);
    res.json(updatedTask);
    }
    catch (e) {
        res.status(404).json({ error: "Task not found" });
      }

});


router.post("/:id/comments", urlencodedParser,async (req, res) => {
  try {  
     const commentData = req.body;
      if(commentData == undefined || !(commentData))throw "The request body is not complete !! "
    
      const { name,comment } = commentData;
      const newupdatedTask = await serverData.addComment(name,comment,req.params.id);
      if(newupdatedTask == undefined || (!newupdatedTask)) { res.json("The new task is not created!! ")}
      res.json(newupdatedTask);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  
  router.delete("/:taskId/:commentId", async (req, res) => {
    try {  
       var modifiedtask = await serverData.removeTask(req.params.taskId,req.params.commentId);

      res.json(modifiedtask);
    } catch (e) {
        res.status(500).json({ error: e });
  }
});
module.exports = router;