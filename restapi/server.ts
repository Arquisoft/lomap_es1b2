import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import api from "./api"; 

const app: Application = express();
const port: number = 5000;

const mongoose = require('mongoose')

const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use("/api", api)

app.listen(port, ():void => {
    console.log('Restapi listening on '+ port);
}).on("error",(error:Error)=>{
    console.error('Error occured: ' + error.message);
});

const user = process.env.REACT_APP_MONGODB_USER
const password = process.env.REACT_APP_MONGODB_PASSWORD
const database = process.env.REACT_APP_MONGODB_DATABASE

mongoose.connect('mongodb+srv://' + user + ':' + password + '@' + database +'/LoMapDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }); 