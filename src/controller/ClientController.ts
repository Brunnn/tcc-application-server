import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { Client } from "../entities/Client";
import { AppDataSource } from "../data-source";
import { IdentificationToken } from "../entities/IdentificationToken";
import { MqttClient } from "mqtt";
/**
 * Loads all posts from the database.
 */

export type BrokerAuthResponse = {
    result: "allow" | "deny" | "ignore";
    is_superuser: boolean;
};

export class ClientController {


    protected static async brandNewClientAuth(request: Request, response: Response, mqttInstance: MqttClient) {
        const tokenRepo = AppDataSource.getRepository(IdentificationToken);
        const clientRepo = AppDataSource.getRepository(Client);

        var usernameSplit = new String(request.body.username).split("/");

        var token = usernameSplit[0];
        var agreedTopic = usernameSplit[1];

        if (!token || !agreedTopic) {
            response.status(401).send();
            return;
        }
        
        var validToken = await tokenRepo.findOneBy({ token: token });
        if (!validToken) {
            response.status(401).send();
            return;
        }

        var client = new Client();
        //the username of the client will be "client_" followed by the table id
        client.username = "client_" + validToken.token;
        let plainPassword = "securePassword123";
        client.password = await hash(plainPassword, 10);
        client.is_server = false;
        let freshClient = await clientRepo.save(client);
        await clientRepo.update(freshClient.id, { username: "client_"+freshClient.id });

        let jsonResp: BrokerAuthResponse = {
            result: "allow",
            is_superuser: client.is_server,
        };

        mqttInstance.publish("client/"+agreedTopic, JSON.stringify({username: "client_"+freshClient.id, password: plainPassword}), {
            retain: true,
            qos: 2,
        });

        response.status(200).send(jsonResp);
    }


    public static async auth(request: Request, response: Response, mqttInstance: MqttClient) {
        const clientRepo = AppDataSource.getRepository(Client);
        var username = request.body.username;
        var password = request.body.password;

        console.log("Authenticating client: ", request.body);
        //Here we check if its a fresh client auth if the only field is the username and its a valid identification token
        if (!password && username) {
            return await ClientController.brandNewClientAuth(request, response, mqttInstance);
        }

        var client = await clientRepo.findOneBy({ username: username });
        if (!client) {
            response.status(401).send();
            return;
        }

        var isPasswordCorrect = await compare(password, client.password);
        if (!isPasswordCorrect) {
            response.status(401).send();
            return;
        }

        let jsonResp: BrokerAuthResponse = {
            result: "allow",
            is_superuser: client.is_server,
        };
        response.status(200).send(jsonResp);
    }

    public static async register(request: Request, response: Response, mqttInstance: MqttClient) {
        const clientRepo = AppDataSource.getRepository(Client);

        var client = new Client();
        client.username = request.body.username;
        client.password = await hash(request.body.password, 10);
        client.is_server = request.body.is_server;
        clientRepo.save(client);

        response.status(200).send();
    }

    public static async registerClientToken(
        request: Request,
        response: Response,
        mqttInstance: MqttClient
    ) {
        const tokenRepo = AppDataSource.getRepository(IdentificationToken);

        var token = new IdentificationToken();
        token.token = request.body.token;
        tokenRepo.save(token);
        response.status(200).send();
    }
}
