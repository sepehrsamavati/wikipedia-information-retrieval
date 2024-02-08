import mongoose from "mongoose";
import { tokenSchemaInfo } from "./token.js";
import { documentSchemaInfo } from "./document.js";
import type { DocumentToken } from "../../../types/entities/documentToken.js";

export const documentTokenSchemaInfo = {
    modelName: 'DocumentToken',
    collectionName: 'documentToken'
} as const;

const schema = new mongoose.Schema<DocumentToken>({
    tf: {
        type: Number,
        required: true,
    },
    // @ts-ignore
    documentId: {
        type: mongoose.Types.ObjectId,
        ref: documentSchemaInfo.modelName,
        required: true,
    },
    // @ts-ignore
    tokenId: {
        type: mongoose.Types.ObjectId,
        ref: tokenSchemaInfo.modelName,
        required: true,
    },
}, { versionKey: false, collection: documentTokenSchemaInfo.collectionName });

schema.index({ tokenId: 1 }, { unique: false });
schema.index({ documentId: 1, tokenId: 1 }, { unique: true });

const DocumentTokenModel = mongoose.model(documentTokenSchemaInfo.modelName, schema);

export default DocumentTokenModel;