import mongoose from "mongoose";
import { documentSchemaInfo } from "./document.js";
import type { DocumentLink } from "../../../types/entities/documentLink.js";

export const documentLinkSchemaInfo = {
    modelName: 'DocumentLink',
    collectionName: 'documentLink'
} as const;

const schema = new mongoose.Schema<DocumentLink>({
    // @ts-ignore
    from: {
        type: mongoose.Types.ObjectId,
        ref: documentSchemaInfo.modelName,
        required: true,
    },
    // @ts-ignore
    to: {
        type: mongoose.Types.ObjectId,
        ref: documentSchemaInfo.modelName,
        required: true,
    },
}, { versionKey: false, collection: documentLinkSchemaInfo.collectionName });

schema.index({ from: 1 }, { unique: false });
schema.index({ to: 1 }, { unique: false });
schema.index({ from: 1, to: 1 }, { unique: false });

const DocumentLinkModel = mongoose.model(documentLinkSchemaInfo.modelName, schema);

export default DocumentLinkModel;