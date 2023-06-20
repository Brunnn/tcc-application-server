"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const ClientController_1 = require("./controller/ClientController");
/**
 * All application routes.
 */
exports.AppRoutes = [
    {
        path: "/auth",
        method: "get",
        action: ClientController_1.ClientController.auth
    },
];
//# sourceMappingURL=routes.js.map