import fs from "node:fs";
import * as dotenv from "dotenv";
dotenv.config();

const config = Object.freeze({
    bigramStopChar: '#',
    httpServer: {
        port: 3023
    },
    crawler: {
        cycleTimeGap: parseInt(process.env.WIR_CRAWLER_CYCLE_TIME_GAP ?? '1000'),
        urlFrontierCountLimit: parseInt(process.env.WIR_URL_FRONTIER_LIMIT ?? '10'),
        seedLinks: (fs.readFileSync(process.env.WIR_CRAWLER_SEED_URLS_FILE ?? "").toString().split('\n').map(line => line.trim().toLocaleLowerCase()).filter(line => URL.canParse(line))) ?? null,
        keywords: process.env.WIR_CRAWLER_WHITELIST_KEYWORDS?.split(',').map(word => word.trim()) ?? []
    },
    mongodb: {
        connectionString: process.env.WIR_MONGO_CONNECTION_STRING ?? ""
    }
});

export default config;
