const mongoCollections = require("../config/mongoCollections");
const appserver = mongoCollections.appserver;
const uuid = require("uuid/v1");

module.exports = {

    async getTaskById(id){
        if((!id) || typeof id !=="string")throw "Please provide valid id!";
        const serverCollection = await appserver();
        const server_array = await serverCollection.find({}).toArray();
        if(server_array.length==0) throw "The collection is empty";
        for(let i=0; i<server_array.length; i++)
        {
            if(server_array[i]._id == id)
            {
                return server_array[i];
            }
        }
        return "Id is not present"
    },

    async getTasks(obj){
        //utmost 100 tasks
        console.log(obj);
        let result_objarr=[];
        let key = Object.keys(obj);
        
        if(Object.keys(obj).length === 0)
        {
            console.log("In 1");
            const serverCollection = await appserver();
            const server_array = await serverCollection.find({}).toArray();
            if(server_array.length==0) throw "The collection is empty";
            result_objarr.push(server_array.splice(0,20));
        }
        else {
            for (key in obj) {
            if(key=="skip"){
                if(typeof(parseInt(obj.skip)) == "number" && !(isNaN(parseInt(obj.skip))))
                {
                    const serverCollection = await appserver();
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
                if(typeof(parseInt(obj.take)) == "number" && !(isNaN(parseInt(obj.take))))
                {
                    const serverCollection = await appserver();
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
                
            
         return result_objarr;
        },

    async  addTask(title,description,hoursEstimated,completed,comments){
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
        //   When we put new comment id??
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
        let newTask ={
            "_id": uuid(),
            "title": title,
            "description": description,
            "hoursEstimated": hoursEstimated,
            "completed": completed,
            "comments": commentarray
          }
 
        let serverCollection = await appserver();
        let newAddedTask = await serverCollection.insertOne(newTask);

        const newId = newAddedTask.insertedId;
        if(!newId)throw "The newId is not present!";
        return await this.getTaskById(newId);
    },

    async updateTask(id, updatedData) {
        const serverCollection = await appserver();
        let task = await this.getTaskById(id);
        if(task == undefined || (!task)){ res.json("The task is not retrieved !! ")}
        let comments = task["comments"];
        if((!id) || typeof id !=="string")throw "Please provide valid id!--update";
        if((!updatedData) || typeof updatedData !=="object")throw "Please provide valid object!";
        const updatedTaskData = {};
        if (updatedData.title) {
            updatedTaskData.title = updatedData.title;
        }
        if (updatedData.description) {
            updatedTaskData.description = updatedData.description;
        }
        if (updatedData.hoursEstimated) {
            updatedTaskData.hoursEstimated = updatedData.hoursEstimated;
        }
        if (updatedData.completed) {
            updatedTaskData.completed = updatedData.completed;
        }
        updatedTaskData.comments = comments;
        await serverCollection.updateOne({_id: id }, { $set: updatedTaskData});
        return await this.getTaskById(id);
      },

      async update_patchTask(id,updateObject){
        if((!id) || typeof id !=="string")throw "Please provide valid id!";
        if((!updateObject) || typeof updateObject !=="object")throw "Please provide valid object!";
        let task = await this.getTaskById(id);
        let comments = task["comments"];
        updateObject["comments"] = comments;

        const serverCollection = await appserver();
        await serverCollection.updateOne({_id  : id}, {$set: updateObject});
        return await this.getTaskById(id);
        },

    async addComment(name,comment,taskid){

        if(!name)throw "Please provide valid name!";
        if(!comment)throw "Please provide valid comment!";
        if(!taskid)throw "Please provide valid taskid!";

        if (typeof name !== "string") throw "name is not a string!";
        if (typeof comment !== "string") throw "comment is not a string!";
        if (typeof taskid !== "string") throw "taskid is not a string!";

        let newComment = {
            "id": uuid(),
            "name": name,
            "comment": comment
          }
        
        let task = await this.getTaskById(taskid);
        let comments = task["comments"];
        comments.push(newComment);
        task["comments"] = comments;

        let serverCollection = await appserver();
        let newAddedTask = await serverCollection.updateOne({_id  : taskid}, {$set: task});
        

        return await this.getTaskById(taskid);

    },


    async removeTask(taskId,commentId){
        //check for task being an object
        
        if((!taskId) || typeof taskId !=="string")throw "Please provide valid taskId!";
        if((!commentId) || typeof commentId !=="string")throw "Please provide valid commentId!";
       
        const serverCollection = await appserver();
        const deletionInfo = serverCollection.updateOne({"_id":taskId},{$pull:{"comments":{"id":commentId}}})
        
        if (deletionInfo.deletedCount === 0) {
        throw `Could not delete recipe with id of ${commentId}`;
        }
        return this.getTaskById(taskId);
    }


};