import type { Types } from "mongoose";
import TokenModel from "../models/token.js";
import { frequencySchemaInfo } from "../models/frequency.js";
import { documentTokenSchemaInfo } from "../models/documentToken.js";
import DocumentModel, { documentSchemaInfo } from "../models/document.js";

export const upsert = async (token: string, documentId: Types.ObjectId | string) => {
    try {
        const alreadyAdded = await TokenModel.exists({ value: token });
        if (alreadyAdded) {
            const res = await TokenModel.findByIdAndUpdate(alreadyAdded._id, { $push: { documents: documentId } });
            return res !== null;
        } else {
            const res = await TokenModel.create({
                value: token,
                documents: [documentId]
            });
            return res !== null;
        }
    } catch {
        return null;
    }
};

export const calculateFrequency = async () => {
    try {
        await TokenModel.aggregate([
            {
                $addFields: {
                    collectionFrequency: {
                        $size: "$documents",
                    },
                },
            },
            {
                $sort: {
                    collectionFrequency: -1,
                },
            },
            {
                $project: {
                    collectionFrequency: 1,
                    uniqueDocuments: {
                        $setUnion: ["$documents"],
                    },
                },
            },
            {
                $addFields: {
                    documentFrequency: {
                        $size: "$uniqueDocuments",
                    },
                },
            },
            {
                $out: frequencySchemaInfo.collectionName,
            },
        ]);
        return true;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const calculateTokenFrequency = async () => {
    try {
        await TokenModel.aggregate([
            {
                $unwind: "$documents",
            },
            {
                $group: {
                    _id: {
                        documentId: "$documents",
                        tokenId: "$_id",
                    },
                    tf: {
                        $sum: 1,
                    },
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        tokenId: "$_id.tokenId",
                        documentId: "$_id.documentId",
                        tf: "$tf",
                    },
                },
            },
            {
                $out: documentTokenSchemaInfo.collectionName,
            },
        ]);
        return true;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getDocuments = async (tokens: string[]) => {
    const docCount = await DocumentModel.countDocuments({ processStatus: "processed" });
    const res = await TokenModel.aggregate([
        {
            $match: {
                value: {
                    $in: tokens,
                },
            },
        },
        {
            $addFields: {
                tid: "$_id",
                document: "$documents",
            },
        },
        {
            $unwind: "$document",
        },
        {
            $group: {
                _id: "$document",
                tid: {
                    $first: "$tid",
                },
                value: {
                    $first: "$value",
                },
                tf: {
                    $sum: 1,
                },
            },
        },
        {
            $lookup: {
                from: documentSchemaInfo.collectionName,
                localField: "_id",
                foreignField: "_id",
                as: "document",
            },
        },
        {
            $unwind: "$document",
        },
        {
            $lookup: {
                from: frequencySchemaInfo.collectionName,
                localField: "tid",
                foreignField: "_id",
                as: "frequency",
                pipeline: [
                    {
                        $project: {
                            documentFrequency: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$frequency",
        },
        {
            $addFields: {
                df: "$frequency.documentFrequency",
            },
        },
        {
            $project: {
                frequency: 0,
            },
        },
        {
            $addFields: {
                tfIdf: {
                    $multiply: [
                        "$tf",
                        {
                            $log10: {
                                $divide: [
                                    {
                                        $literal: docCount,
                                    },
                                    "$df", // Assuming you have a field named "df" for Document Frequency
                                ],
                            },
                        },
                    ],
                },
            },
        },
        {
            $sort: {
                tfIdf: -1,
            },
        },
        {
            $project: {
                _id: "$document._id",
                content: "$document.rawContent",
                tf: 1,
                df: 1,
                tfIdf: 1,
            },
        },
    ]);
};
