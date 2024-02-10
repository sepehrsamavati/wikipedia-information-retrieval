import mongoose from "mongoose";
import { urlFrontierSchemaInfo } from "./urlFrontier.js";
import { Document, documentProcessStatuses } from "../../../types/entities/document.js";

export const documentSchemaInfo = {
    modelName: 'Document',
    collectionName: 'document'
} as const;

const schema = new mongoose.Schema<Document>({
    crawlerId: {
        type: String,
        required: true,
    },
    processorId: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    rawContent: {
        type: String,
        required: true,
    },
    rawHtml: {
        type: String,
        required: true
    },
    // @ts-ignore
    url: {
        type: mongoose.Types.ObjectId,
        ref: urlFrontierSchemaInfo.modelName,
        required: true,
        unique: true
    },
    processStatus: {
        type: String,
        required: true,
        enum: documentProcessStatuses
    },
    createDate: {
        type: Date,
        required: true
    },
    processDate: {
        type: Date,
        required: false
    }
}, { versionKey: false, collection: documentSchemaInfo.collectionName });

const DocumentModel = mongoose.model(documentSchemaInfo.modelName, schema);

export default DocumentModel;