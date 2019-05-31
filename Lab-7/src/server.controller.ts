import * as express from 'express';
const router = express.Router();
import {MongoHelper} from './mongo.helper';
import * as uuid from 'uuid/v1';

import * as bodyParser from 'body-parser';
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const getCollection = () =>{
    return MongoHelper.client.db('Patole-Shivani-CS554-Lab7').collection('appserver')
}


router.get('/',async(req: express.Request,res: express.Response,next: express.NextFunction)=>{
  try{
        let obj = req.query;
        let result_objarr=[];
        let key  = Object.keys(obj);
        
        if(Object.keys(obj).length === 0)
        {
            console.log("In 1");
            const serverCollection = getCollection();
            const server_array = await serverCollection.find({}).toArray();
            if(server_array.length==0) throw "The collection is empty";
            result_objarr.push(server_array.splice(0,20));
        }
        else {
            for (let key in obj) {
            if(key=="skip"){
                if(typeof(parseInt(obj["skip"])) == "number" && !(isNaN(parseInt(obj["skip"]))))
                {
                    const serverCollection = getCollection();
                    const server_array = await serverCollection.find({}).toArray();
                    if(server_array.length==0) throw "The collection is empty";
                    if (result_objarr.length == 0)
                    {
                    result_objarr= server_array.splice(obj[key],server_array.length+1);
                    }
                    else{
                        result_objarr = result_objarr.splice(obj[key],server_array.length+1);
                    }
                }
                else{
                    throw "Please provide a number";
                }
            }
            else if(key=="take"){
                if(typeof(parseInt(obj["take"])) == "number" && !(isNaN(parseInt(obj["take"]))))
                {
                    const serverCollection = getCollection();
                    const server_array = await serverCollection.find({}).toArray();
                    if(server_array.length==0) throw "The collection is empty";
                    if (obj[key] < 100)
                    {
                        if (result_objarr.length == 0)
                        {
                            //check for error should be thrown if that many records are not present
                            result_objarr=server_array.splice(0,obj[key]); 
                        }
                        else{
                            result_objarr = result_objarr.splice(0,obj[key]);
                        }
                    }
                    else{
                        if (result_objarr.length == 0)
                        {
                            result_objarr=server_array.splice(0,100);
                        }else{
                        result_objarr = result_objarr.splice(0,100);
                        }
                    }
                }
                else{
                    throw "Please provide a number";
                }
            }
            }
        }
        res.json(result_objarr);
        res.end();
      }
      catch(e)
      {
          res.status(404).json({error:"Task not found!"})
      }   
});

router.get('/:id',async(req: express.Request,res: express.Response,next: express.NextFunction)=>{
    try{
        let id = req.params.id;
       if((!id) || typeof id !=="string")throw "Please provide valid id!";
        const serverCollection = getCollection();
        const server_array = await serverCollection.find({}).toArray();
        if(server_array.length==0) throw "The collection is empty";
        for(let i=0; i<server_array.length; i++)
        {
            if(server_array[i]._id == id)
            {
                res.json(server_array[i]);
            }
        }
        res.json("Task not present");
        res.end();
    }
    catch(e)
    {
        res.status(404).json({error:"Task not found!"})
    }
});

router.post("/", urlencodedParser,async (req: express.Request,res: express.Response,next: express.NextFunction) => {
  try {  
  const taskData = req.body;
    if(taskData == undefined || !(taskData))throw "The request body is not complete !! "
    
    let { title,description,hoursEstimated,completed,comments } = taskData;
    if(!title)throw "Please provide valid title!";
        if(!description)throw "Please provide valid description!";
        if(!hoursEstimated)throw "Please provide valid hoursEstimated!";

        if (typeof title !== "string") throw "title is not a string!";
        if (typeof description !== "string") throw "description is not a string!";
        if (typeof hoursEstimated !== "number") throw "hoursEstimated is not a number!";
        if (typeof completed !== "boolean") throw "completed is not a boolean!";
        if (!Array.isArray(comments)) {
            comments = [];
          }
        var commentarray = [];

        for(var i=0; i<comments.length; i++)
        {
            if(!(comments[i]["name"]))throw "Please provide valid name!";
            if(!(comments[i]["comment"]))throw "Please provide valid comment!";
            if (typeof(comments[i]["name"]) !== "string") throw "name is not a string!";
            if (typeof (comments[i]["comment"]) !== "string") throw "comment is not a string!";
            var newComment = {
                "id":uuid(),
                "name": comments[i]["name"],
                "comment": comments[i]["comment"]
            }
            commentarray.push(newComment);
        }
        let newTask1 ={
            "_id": uuid(),
            "title": title,
            "description": description,
            "hoursEstimated": hoursEstimated,
            "completed": completed,
            "comments": commentarray
          }
 
        const serverCollection = getCollection();
        let newAddedTask = await serverCollection.insertOne(newTask1);

        const newId = newAddedTask.insertedId;


        if((!newId) || typeof newId !=="string")throw "Please provide valid id!";
        const server_array = await serverCollection.find({}).toArray();
        if(server_array.length==0) throw "The collection is empty";
        for(let i=0; i<server_array.length; i++)
        {
            if(server_array[i]._id == newId)
            {
                res.json(server_array[i]);
            }
        }
        res.json("The new task is not created");

      res.end();
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.put("/:id", async (req: express.Request,res: express.Response,next: express.NextFunction) => {
    try {
        let id =  req.params.id;
      const updatedData = req.body;
      if(req.params.id == undefined || (!req.params.id)) throw "The id is not retrieved !!  "
      if(updatedData == undefined || (!updatedData))throw "The task is not retrieved !! "
      if(!updatedData.title) throw "Please provide a title"
      if(!updatedData.description) throw "Please provide a description"
      if(!updatedData.hoursEstimated) throw "Please provide hoursEstimated "
      if(!updatedData.completed) throw "Please provide a completed"
      if(!updatedData.comments) throw "Please provide a comments"

      const serverCollection = getCollection();
      if((!id) || typeof id !=="string")throw "Please provide valid id!";
      const server_array = await serverCollection.find({}).toArray();
      if(server_array.length==0) throw "The collection is empty";
      let task = undefined;
      for(let i=0; i<server_array.length; i++)
        {
            if(server_array[i]._id == id)
            {
                task =  server_array[i];
            }
        }

        if(task == undefined || (!task))throw 'The task is not retrieved !! ';
        let comments = task["comments"];
        if((!id) || typeof id !=="string")throw "Please provide valid id!--update";
        if((!updatedData) || typeof updatedData !=="object")throw "Please provide valid object!";
        const updatedTaskData = {};
        if (updatedData["title"]) {
            updatedTaskData["title"] = updatedData["title"];
        }
        if (updatedData["description"]) {
            updatedTaskData["description"] = updatedData["description"];
        }
        if (updatedData["hoursEstimated"]) {
            updatedTaskData["hoursEstimated"] = updatedData["hoursEstimated"];
        }
        if (updatedData["completed"]) {
            updatedTaskData["completed"] = updatedData["completed"];
        }
        updatedTaskData["comments"] = comments;
        await serverCollection.updateOne({_id: id }, { $set: updatedTaskData});
        let updatedTask1 = await serverCollection.findOne({_id:id});
        
        res.json(updatedTask1);

      res.end();
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.patch('/:id', async (req: express.Request,res: express.Response,next: express.NextFunction)=> {
    try{
    const updateObject = req.body;
    if(updateObject == undefined || (!updateObject)|| typeof updateObject !=="object")throw "Please provide valid object!";
    const id = req.params.id;
    if(id == undefined ||typeof id !=="string" || (!id)) throw "Please provide valid id !!  ";
    const serverCollection = getCollection();
    let task = await serverCollection.findOne({_id:id});
    let comments = task["comments"];
    updateObject["comments"] = comments;
    await serverCollection.updateOne({_id  : id}, {$set: updateObject});
    let updatedTask1 = await serverCollection.findOne({_id:id});
    res.json(updatedTask1);
    res.end();
    }
    catch (e) {
        res.status(404).json({ error: "Task not found" });
      }

});


router.post("/:id/comments", urlencodedParser,async (req: express.Request,res: express.Response,next: express.NextFunction) => {
  try {  
     const commentData = req.body;
     let id = req.params.id;
      if(commentData == undefined || !(commentData))throw "The request body is not complete !! "
      const { name,comment } = commentData;

      if(!name)throw "Please provide valid name!";
        if(!comment)throw "Please provide valid comment!";
        if(!id)throw "Please provide valid taskid!";

        if (typeof name !== "string") throw "name is not a string!";
        if (typeof comment !== "string") throw "comment is not a string!";
        if (typeof id !== "string") throw "taskid is not a string!";

        let newComment = {
            "id": uuid(),
            "name": name,
            "comment": comment
          }
        
        const serverCollection = getCollection();
        let task = await serverCollection.findOne({_id:id});

        let comments = task["comments"];
        comments.push(newComment);
        task["comments"] = comments;

        await serverCollection.updateOne({_id  : id}, {$set: task});

        let newAddedTask = await serverCollection.findOne({_id:id});

      if(newAddedTask == undefined || (!newAddedTask)) { res.json("The new task is not created!! ")}
      res.json(newAddedTask);
    //   res.end();
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  
  router.delete("/:taskId/:commentId", async (req: express.Request,res: express.Response,next: express.NextFunction) => {
    try {  
        let taskId = req.params.taskId;
        let commentId = req.params.commentId;
        if((!taskId) || typeof taskId !=="string")throw "Please provide valid taskId!";
        if((!commentId) || typeof commentId !=="string")throw "Please provide valid commentId!";
       
        const serverCollection = getCollection();
        const deletionInfo = await serverCollection.updateOne({"_id":taskId},{$pull:{"comments":{"id":commentId}}})
        
        if (deletionInfo["deletedCount"] === 0) {
        throw `Could not delete recipe with id of ${commentId}`;
        }

        let modifiedtask = await serverCollection.findOne({_id:taskId});
        

      res.json(modifiedtask);
      res.end();
    } catch (e) {
        res.status(500).json({ error: e });
  }
});

export {router};