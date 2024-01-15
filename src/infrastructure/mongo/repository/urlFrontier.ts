import type { Types } from "mongoose";
import UrlFrontierModel from "../models/urlFrontier.js";
import type { UrlCrawlStatus, UrlFrontierUrl } from "../../../types/entities/urlFrontier";

export const add = async (url: UrlFrontierUrl) => {
    try {
        const res = await UrlFrontierModel.create(url);
        return true;
    } catch {
        return false;
    }
};

export const takeUrl = async (_crawlerId?: unknown) => {
    try {
        const res = await UrlFrontierModel.findOneAndUpdate<UrlFrontierUrl>({ status: "not_visited" }, { status: "in_progress" }).lean();
        return (res as unknown as (UrlFrontierUrl & { _id: Types.ObjectId })) ?? null;
    } catch {
        return null;
    }
};

export const setStatusById = async (_id: Types.ObjectId | string, status: UrlCrawlStatus) => {
    try {
        const updateObject: Partial<UrlFrontierUrl> = { status };

        if(status === "visited") {
            updateObject.visitedDate = new Date();
        }

        const res = await UrlFrontierModel.findByIdAndUpdate<UrlFrontierUrl>(_id, updateObject);
        return true;
    } catch {
        return false;
    }
};
