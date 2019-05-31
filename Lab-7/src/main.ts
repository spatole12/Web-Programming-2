import {app} from './app';
import * as http from 'http';

import { MongoHelper } from './mongo.helper';

const PORT = 3000;
const server = http.createServer(app);
server.listen(PORT);
server.on('listening',async()=>{
    console.log(`Listening on post ${PORT}`);
    try{
        await MongoHelper.connect('mongodb://127.0.0.1:27017');
        console.log('Connected to Mongo...');
    }catch(err){
        console.log(err);
    }
});