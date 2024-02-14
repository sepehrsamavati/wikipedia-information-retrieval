import mongoose from "mongoose";
import { documentSchemaInfo } from "./document.js";
import type { Token } from "../../../types/entities/token.js";

export const tokenSchemaInfo = {
    modelName: 'Token',
    collectionName: 'token'
} as const;

const schema = new mongoose.Schema<Token>({
    value: {
        type: String,
        unique: true,
        required: true,
    }
}, { versionKey: false, collection: tokenSchemaInfo.collectionName });

const TokenModel = mongoose.model(tokenSchemaInfo.modelName, schema);

export default TokenModel;