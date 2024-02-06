import { closeConnection, connect } from "../../infrastructure/mongo/connection.js";
import { calculateFrequency } from "../../infrastructure/mongo/repository/token.js";

await connect();
await calculateFrequency();
await closeConnection();
