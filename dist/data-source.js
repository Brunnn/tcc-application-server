"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Client_1 = require("./entities/Client");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "tcc",
    synchronize: true,
    logging: true,
    entities: [Client_1.Client],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map