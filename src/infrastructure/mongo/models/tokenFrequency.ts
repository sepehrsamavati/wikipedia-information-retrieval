import mongoose from "mongoose";
import { documentSchemaInfo } from "./document.js";
import type { TokenFrequency } from "../../../types/entities/tokenFrequency.js";

export const tokenFrequencySchemaInfo = {
    modelName: 'TokenFrequency',
    collectionName: 'tokenFrequency'
} as const;

const schema = new mongoose.Schema<TokenFrequency>({
    docScore: {
        type: Number,
        required: true,
    },
    repoScore: {
        type: Number,
        required: true,
    },
    uniqueDocuments: [{
        type: mongoose.Types.ObjectId,
        ref: documentSchemaInfo.modelName,
        required: true,
    }]
}, { versionKey: false, collection: tokenFrequencySchemaInfo.collectionName });

const TokenFrequencyModel = mongoose.model(tokenFrequencySchemaInfo.modelName, schema);

export default TokenFrequencyModel;