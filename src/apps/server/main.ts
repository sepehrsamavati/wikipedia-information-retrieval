import app from "./app.js";
import config from "../../config.js";
import { closeConnection, connect } from "../../infrastructure/mongo/connection.js";

await connect();

const server = app.listen(config.httpServer.port);

server.once('listening', () => {
    console.log("HTTP server ready.");
});


server.once('close', async () => {
    console.log("HTTP server closed.");
    await closeConnection();
});
