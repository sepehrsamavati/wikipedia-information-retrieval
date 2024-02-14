import type { PipelineStage, Types } from "mongoose";
import TokenModel from "../models/token.js";
import { frequencySchemaInfo } from "../models/frequency.js";
import { urlFrontierSchemaInfo } from "../models/urlFrontier.js";
import DocumentModel, { documentSchemaInfo } from "../models/document.js";
import DocumentTokenModel, { documentTokenSchemaInfo } from "../models/documentToken.js";

export const upsert = async (token: string, documentId: Types.ObjectId | string) => {
    try {
        let tokenId: Types.ObjectId;
        const alreadyAdded = await TokenModel.exists({ value: token });
        if (alreadyAdded) {
            const res = await TokenModel.findByIdAndUpdate(alreadyAdded._id, { $push: { documents: documentId } });
            if (!res) return null;
            tokenId = res._id;
        } else {
            const res = await TokenModel.create({
                value: token
            });
            if (!res) return null;
            tokenId = res._id;
        }
        const documentToken = await DocumentTokenModel.exists({ tokenId, documentId });
        if (documentToken) {
            await DocumentTokenModel.findByIdAndUpdate(documentToken._id, { $inc: { tf: 1 } });
        } else {
            await DocumentTokenModel.create({
                tokenId, documentId, tf: 1
            });
        }
        return tokenId;
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

/**
 * 
 * @deprecated
 */
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

const retrieveBaseAggregation = (tokens: string[], docCount: number) => {
    const weightTfIdf = 0.7;
    const weighPageRank = 0.3;
    return (
        [{
            $match: {
                value: {
                    $in: tokens,
                },
            },
        },
        {
            $lookup: {
                from: documentTokenSchemaInfo.collectionName,
                localField: "_id",
                foreignField: "tokenId",
                as: "documents",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            tokenId: 0,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                tid: "$_id",
                document: "$documents",
            },
        },
        {
            $project: {
                documents: 0,
            },
        },
        {
            $unwind: "$document",
        },
        {
            $addFields: {
                tf: "$document.tf",
            },
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
                documentId: "$document.documentId",
            },
        },
        {
            $project: {
                frequency: 0,
                document: 0,
            },
        },
        {
            $addFields: {
                tfIdf: {
                    $multiply: [
                        {
                            $log10: {
                                $add: [1, "$tf"],
                            },
                        },
                        {
                            $log10: {
                                $divide: [
                                    {
                                        $literal: docCount,
                                    },
                                    "$df",
                                ],
                            },
                        },
                    ],
                },
            },
        },
        {
            $lookup: {
                from: documentSchemaInfo.collectionName,
                localField: "documentId",
                foreignField: "_id",
                as: "document",
                pipeline: [
                    {
                        $project: {
                            rawContent: 1,
                            pageRank: 1,
                            url: 1,
                            title: 1,
                        },
                    },
                ],
            }
        },
        {
            $unwind: "$document"
        },
        {
            $group: {
                _id: "$documentId",
                document: {
                    $first: "$document",
                },
                tokens: {
                    $addToSet: {
                        tid: "$tid",
                        value: "$value",
                        tf: "$tf",
                    },
                },
                tfIdfScore: {
                    $sum: "$tfIdf",
                },
            }
        },
        {
            $addFields: {
                score: {
                    $add: [
                        { $multiply: [weightTfIdf, "$tfIdfScore"], },
                        { $multiply: [weighPageRank, "$document.pageRank"], },
                    ],
                },
            }
        },
        {
            $sort: {
                score: -1,
            },
        },
        {
            $project: {
                _id: "$document._id",
                title: "$document.title",
                content: "$document.rawContent",
                url: "$document.url",
                tfIdfScore: 1,
                pageRank: "$document.pageRank",
                score: 1
            },
        }]
    ) as PipelineStage[];
};

export const getDocuments = async (tokens: string[]) => {
    try {
        const docCount = await DocumentModel.countDocuments({ processStatus: "processed" });
        let count = 0;
        const startTime = performance.now();
        const countRes: { count: number }[] = await TokenModel.aggregate([...retrieveBaseAggregation(tokens, docCount), { $count: 'count' }]).exec();
        const endTime = performance.now();
        if (countRes.length === 1) {
            count = countRes[0].count;
        }
        const res: {
            _id: Types.ObjectId;
            content: string;
            tfIdfScore: number;
            pageRank: number;
            score: number;
            url: string;
            title: string;
        }[] = await TokenModel.aggregate([
            ...retrieveBaseAggregation(tokens, docCount),
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: urlFrontierSchemaInfo.collectionName,
                    localField: "url",
                    foreignField: "_id",
                    as: "url",
                    pipeline: [
                        {
                            $project: {
                                url: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$url",
            },
            {
                $addFields: {
                    url: "$url.url"
                }
            }
        ], {
            allowDiskUse: true
        }).exec();
        return {
            res, count, time: Math.round(endTime - startTime)
        };
    } catch (e) {
        console.error(e);
        return null;
    }
};
