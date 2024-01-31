import config from "../../config.js";
import { add } from "../../infrastructure/mongo/repository/urlFrontier.js";
import { connect, closeConnection } from "../../infrastructure/mongo/connection.js";

await connect();

await Promise.allSettled(config.crawler.seedLinks.map(link => add({
    url: link,
    depth: 0,
    createDate: new Date(),
    status: "not_visited",
    linkedBy: []
})));

console.log("URL frontier seed done ✅");

await closeConnection();
