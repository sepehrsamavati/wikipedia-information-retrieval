import type { Types } from "mongoose";
import DocumentModel, { documentSchemaInfo } from "../models/document.js";
import type { Document, DocumentProcessStatuses } from "../../../types/entities/document";
import { urlFrontierSchemaInfo } from "../models/urlFrontier.js";
import DocumentLinkModel from "../models/documentLink.js";

export const exists = async (url: string) => {
    try {
        return await DocumentModel.exists({ url: url });
    } catch {
        return null;
    }
};

export const add = async (document: Document) => {
    try {
        const res = await DocumentModel.create(document);
        return true;
    } catch (e) {
        console.error("Document add error", e);
        return false;
    }
};

export const takeDocument = async (processorId: string) => {
    try {
        const res = await DocumentModel.findOneAndUpdate<Document>({ processStatus: "not_processed" }, { processorId, processStatus: "processing" }).lean();
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

export const addRelations = async () => {
    try {
        const documents: { _id: string; relatedDocuments: string[] }[] = await DocumentModel.aggregate([
            {
                $project: {
                    url: 1,
                },
            },
            {
                $lookup: {
                    from: urlFrontierSchemaInfo.collectionName,
                    localField: "url",
                    foreignField: "_id",
                    as: "relatedUrls",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                linkedBy: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$relatedUrls",
            },
            {
                $lookup: {
                    from: documentSchemaInfo.collectionName,
                    localField: "relatedUrls.linkedBy",
                    foreignField: "url",
                    as: "relatedDocuments",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    relatedDocuments: "$relatedDocuments._id",
                },
            },
        ]).exec();

        let insertCount = 0;

        for (const doc of documents) {
            console.log(`${++insertCount}/${documents.length}`);
            for (const relatedDocId of doc.relatedDocuments) {
                await DocumentLinkModel.create({
                    from: relatedDocId,
                    to: doc._id
                });
            }
        }

    } catch (e) {
        console.error("Add document relation", e);
        return null;
    }
};
