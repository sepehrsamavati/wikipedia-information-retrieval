import mongoose from "mongoose";
import { UrlFrontierUrl, crawlStatuses } from "../../../types/entities/urlFrontier.js";

const schema = new mongoose.Schema<UrlFrontierUrl>({
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
}, { versionKey: false, collection: 'urlFrontier' });

const UrlFrontierModel = mongoose.model('UrlFrontier', schema);

export default UrlFrontierModel;