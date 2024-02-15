import type { Types } from "mongoose";
import UrlFrontierModel from "../models/urlFrontier.js";
import type { UrlCrawlStatus, UrlFrontierUrl } from "../../../types/entities/urlFrontier";

export const exists = async (url: string) => {
    try {
        return await UrlFrontierModel.exists({ url: url });
    } catch {
        return null;
    }
};

export const addLinkedBy = async (id: Types.ObjectId | string, linkedBy: Types.ObjectId | string) => {
    try {
        const res = await UrlFrontierModel.findByIdAndUpdate(id, { $push: { linkedBy } });
        return res !== null;
    } catch {
        return null;
    }
};

export const add = async (url: UrlFrontierUrl) => {
    try {
        const res = await UrlFrontierModel.create(url);
        return true;
    } catch {
        return false;
    }
};

export const takeUrl = async (crawlerId: string) => {
    try {
        const res = await UrlFrontierModel.findOneAndUpdate<UrlFrontierUrl>({ status: "not_visited" }, { crawlerId, status: "in_progress" }).lean();
        return (res as unknown as (UrlFrontierUrl & { _id: Types.ObjectId })) ?? null;
    } catch {
        return null;
    }
};

export const setRedirectToById = async (_id: Types.ObjectId | string, redirectTo: string) => {
    try {
        const res = await UrlFrontierModel.findByIdAndUpdate<UrlFrontierUrl>(_id, { redirectTo });
        return true;
    } catch {
        return false;
    }
};

export const setStatusById = async (_id: Types.ObjectId | string, status: UrlCrawlStatus) => {
    try {
        const updateObject: Partial<UrlFrontierUrl> = { status };

        if (status === "visited") {
            updateObject.visitedDate = new Date();
        }

        const res = await UrlFrontierModel.findByIdAndUpdate<UrlFrontierUrl>(_id, updateObject);
        return true;
    } catch {
        return false;
    }
};

export const count = async () => {
    try {
        return await UrlFrontierModel.countDocuments();
    } catch {
        return null;
    }
};
