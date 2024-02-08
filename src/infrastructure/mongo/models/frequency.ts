import mongoose from "mongoose";
import { documentSchemaInfo } from "./document.js";
import type { Frequency } from "../../../types/entities/frequency.js";

export const frequencySchemaInfo = {
    modelName: 'Frequency',
    collectionName: 'frequency'
} as const;

const schema = new mongoose.Schema<Frequency>({
    collectionFrequency: {
        type: Number,
        required: true,
    },
    documentFrequency: {
        type: Number,
        required: true,
    },
    uniqueDocuments: [{
        type: mongoose.Types.ObjectId,
        ref: documentSchemaInfo.modelName,
        required: true,
    }]
}, { versionKey: false, collection: frequencySchemaInfo.collectionName });

const FrequencyModel = mongoose.model(frequencySchemaInfo.modelName, schema);

export default FrequencyModel;