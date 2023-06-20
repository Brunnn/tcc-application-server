import { DataSource } from "typeorm";
import { Client } from "./entities/Client";
import { IdentificationToken } from "./entities/IdentificationToken";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "tcc",
    synchronize: true,
    logging: false,
    entities: [Client, IdentificationToken],
    subscribers: [],
    migrations: [],
})