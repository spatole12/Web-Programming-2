const bluebird = require("bluebird");
const express = require("express");
const app = express();
const redis = require("redis");
const client = redis.createClient();
const data = require("./data");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.get("/api/people/history", async (req, res) => {
    try{

        let data_arr = await client.lrangeAsync("recent_history_id_arr",0,20);
        for(var i=0; i<data_arr.length; i++)
            {
                var data_obj = await client.getAsync(data_arr[i]);
                await client.lpush("recent_history_arr",data_obj);
            }
    
        let result_arr = await client.lrangeAsync("recent_history_arr",0,20);
        for(var j = 0;j<result_arr.length;j++){
            result_arr[j]=JSON.parse(result_arr[j]);

        }
        res.json(result_arr);
        await client.del("recent_history_arr");
    }
    catch (e) {
        res.status(404).json({ error: "History not found" });
      }
     
});

app.get("/api/people/:id", async (req, res) => {
    let id = req.params.id;
    try{

    let personExists = await client.getAsync(Number(id));
    if (personExists) {
        await client.lpush("recent_history_id_arr",id);
        res.json(JSON.parse(personExists)); 
      } else {
          let userdta = await data.getById(id);
          await client.setAsync(id,JSON.stringify(userdta));
          await client.lpush("recent_history_id_arr",id);
          res.json(userdta);
      }
    }
    catch (e) {
        res.status(404).json({ error: "Record not found" });
      }
});




app.get("*", async (req, res) => {
    res.status(404).json({ error: "404 Page not found" });;
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});