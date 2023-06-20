import { ClientController } from "./controller/ClientController";


/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: "/auth",
        method: "post",
        action: ClientController.auth
    },
    {
        path: "/register",
        method: "post",
        action: ClientController.register
    },
    {
        path: "/id-token/register",
        method: "post",
        action: ClientController.registerClientToken
    }
 
];