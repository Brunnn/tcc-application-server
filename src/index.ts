import "reflect-metadata";
import {Request, Response} from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import {AppRoutes} from "./routes";
import { AppDataSource } from "./data-source";
import { initializeMQTT } from "./mqtt";
import 'dotenv/config'

// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
AppDataSource.initialize().then(async connection => {

    var mqttInstance = initializeMQTT();

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register all application routes
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: Request, response: Response, next: Function) => {
            route.action(request, response, mqttInstance)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    // run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000");


}).catch(error => console.log("TypeORM connection error: ", error));
