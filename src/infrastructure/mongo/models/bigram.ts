import mongoose from "mongoose";
import { documentSchemaInfo } from "./document.js";
import type { Bigram } from "../../../types/entities/bigram.js";

export const bigramSchemaInfo = {
    modelName: 'Bigram',
    collectionName: 'bigram'
} as const;

const schema = new mongoose.Schema<Bigram>({
    start: {
        type: String,
        index: true,
        required: true,
    },
    end: {
        type: String,
        index: true,
        required: true
    },
    documents: [{
        type: mongoose.Types.ObjectId,
        ref: documentSchemaInfo.modelName,
        required: true,
    }]
}, { versionKey: false, collection: bigramSchemaInfo.collectionName });

schema.index({ start: 1, end: 1 }, { unique: true });

const BigramModel = mongoose.model(bigramSchemaInfo.modelName, schema);

export default BigramModel;