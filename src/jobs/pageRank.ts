import type { Types } from "mongoose";
import { closeConnection, connect } from "../infrastructure/mongo/connection.js";
import DocumentModel from "../infrastructure/mongo/models/document.js";
import DocumentLinkModel from "../infrastructure/mongo/models/documentLink.js";

// Damping factor (usually set to 0.85)
const dampingFactor = 0.85;
// Maximum number of iterations
const maxIterations = 10;

type Graph = Map<string, string[]>;

function calculatePageRank(graph: Graph, dampingFactor: number, maxIterations: number) {
    const nodeCount = graph.size;
    const initialPageRank = 1 / nodeCount;

    let pageRankValues: { [key: string]: number } = {};
    let outgoingLinks: { [key: string]: number } = {};

    // Initialize pageRank values and outgoing links
    for (const [key, value] of graph.entries()) {
        pageRankValues[key] = initialPageRank;
        outgoingLinks[key] = value.length;
    }

    // Perform PageRank iterations
    for (let iteration = 1; iteration <= maxIterations; iteration++) {
        let newPageRankValues: { [key: string]: number } = {};

        let totalPageRank = 0;

        for (const [key, value] of graph.entries()) {
            newPageRankValues[key] = 0;

            for (let linkingNode of value) {
                // dangling node
                if (outgoingLinks[linkingNode] === 0) {
                    newPageRankValues[key] += pageRankValues[linkingNode] / nodeCount;
                } else {
                    newPageRankValues[key] += pageRankValues[linkingNode] / outgoingLinks[linkingNode];
                }
            }

            newPageRankValues[key] *= dampingFactor;
            newPageRankValues[key] += (1 - dampingFactor) / nodeCount;

            totalPageRank += newPageRankValues[key];
        }

        // Normalize pageRank values
        for (const key of graph.keys()) {
            newPageRankValues[key] += (1 - totalPageRank) / nodeCount;

        }

        pageRankValues = newPageRankValues;
    }

    for (const pageRank in pageRankValues) {
        pageRankValues[pageRank] *= 200;
    }

    return pageRankValues;
}

await connect();

const documents = await DocumentModel.find().select(['_id']).lean();

const graph: Graph = new Map();

documents.forEach(doc => {
    graph.set(doc._id.toString(), []);
});


const links = await DocumentLinkModel.find().select(['from', 'to']).lean();

links.forEach(link => {
    graph.get(link.from.toString())?.push(link.to.toString());
});

const pageRankValues = calculatePageRank(graph, dampingFactor, maxIterations);

const docCount = Object.keys(pageRankValues).length;
let insertCount = 0;
for (const [docId, pageRank] of Object.entries(pageRankValues)) {
    console.log(`${++insertCount}/${docCount}`);
    try {
        await DocumentModel.findByIdAndUpdate(docId, { pageRank });
    } catch (e) {
        console.error(e);
    }
}

await closeConnection();
