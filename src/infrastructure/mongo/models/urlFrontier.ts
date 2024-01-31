import mongoose from "mongoose";
import { UrlFrontierUrl, crawlStatuses } from "../../../types/entities/urlFrontier.js";

export const urlFrontierSchemaInfo = {
    modelName: 'UrlFrontier',
    collectionName: 'urlFrontier'
} as const;

const schema = new mongoose.Schema<UrlFrontierUrl>({
    crawlerId: {
        type: String,
        required: false,
    },
    parentUrl: {
        type: mongoose.Types.ObjectId,
        ref: urlFrontierSchemaInfo.modelName
    },
    linkedBy: [{
        type: mongoose.Types.ObjectId,
        ref: urlFrontierSchemaInfo.modelName,
        required: true
    }],
	url: {
		type: String,
		required: true,
        unique: true
	},
    priority: {
        type: Number,
        required: false,
        min: 0,
        max: 999
    },
    depth: {
        type: Number,
        required: true,
        min: 0,
    },
	status: {
		type: String,
		required: true,
        enum: crawlStatuses
	},
    createDate: {
        type: Date,
        required: true
    },
    visitedDate: {
        type: Date,
        required: false
    }
}, { versionKey: false, collection: urlFrontierSchemaInfo.collectionName });

const UrlFrontierModel = mongoose.model(urlFrontierSchemaInfo.modelName, schema);

export default UrlFrontierModel;