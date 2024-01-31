import type { Types } from "mongoose";
import DocumentModel from "../models/document.js";
import type { Document, DocumentProcessStatuses } from "../../../types/entities/document";

export const exists = async (url: string) => {
    try {
        return await DocumentModel.exists({ url: url });
    } catch {
        return null;
    }
};

export const addLinkedBy = async (id: Types.ObjectId | string, linkedBy: Types.ObjectId | string) => {
    try {
        const res = await DocumentModel.findByIdAndUpdate(id, { $push: { linkedBy } });
        return res !== null;
    } catch {
        return null;
    }
};

export const add = async (document: Document) => {
    try {
        const res = await DocumentModel.create(document);
        return true;
    } catch(e) {
        console.error("Document add error", e);
        return false;
    }
};

export const takeUrl = async (crawlerId: string) => {
    try {
        const res = await DocumentModel.findOneAndUpdate<Document>({ status: "not_visited" }, { crawlerId, status: "in_progress" }).lean();
        return (res as unknown as (Document & { _id: Types.ObjectId })) ?? null;
    } catch {
        return null;
    }
};

export const setStatusById = async (_id: Types.ObjectId | string, status: DocumentProcessStatuses) => {
    try {
        const updateObject: Partial<Document> = { processStatus: status };

        if (status === "processed") {
            updateObject.processDate = new Date();
        }

        const res = await DocumentModel.findByIdAndUpdate<Document>(_id, updateObject);
        return true;
    } catch {
        return false;
    }
};

export const count = async () => {
    try {
        return await DocumentModel.countDocuments();
    } catch {
        return null;
    }
};
