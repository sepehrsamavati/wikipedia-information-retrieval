import mongoose from "mongoose";
import type { TokenFrequency } from "../../../types/entities/tokenFrequency.js";

export const tokenFrequencySchemaInfo = {
    modelName: 'TokenFrequency',
    collectionName: 'tokenFrequency'
} as const;

const schema = new mongoose.Schema<TokenFrequency>({
    collectionFrequency: {
        type: Number,
        required: true,
    },
    documentFrequency: {
        type: Number,
        required: true,
    }
}, { versionKey: false, collection: tokenFrequencySchemaInfo.collectionName });

const TokenFrequencyModel = mongoose.model(tokenFrequencySchemaInfo.modelName, schema);

export default TokenFrequencyModel;