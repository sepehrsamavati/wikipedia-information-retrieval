import mongoose from "mongoose";
import { documentSchemaInfo } from "./document.js";
import type { Bigram } from "../../../types/entities/bigram.js";

export const bigramSchemaInfo = {
    modelName: 'Bigram',
    collectionName: 'bigram'
} as const;

const schema = new mongoose.Schema<Bigram>({
    value: {
        type: String,
        unique: true,
        required: true,
    },
    documents: [{
        type: mongoose.Types.ObjectId,
        ref: documentSchemaInfo.modelName,
        required: true,
    }]
}, { versionKey: false, collection: bigramSchemaInfo.collectionName });

const BigramModel = mongoose.model(bigramSchemaInfo.modelName, schema);

export default BigramModel;