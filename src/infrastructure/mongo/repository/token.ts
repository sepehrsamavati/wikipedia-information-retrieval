import type { Types } from "mongoose";
import TokenModel from "../models/token.js";
import DocumentModel, { documentSchemaInfo } from "../models/document.js";
import { tokenFrequencySchemaInfo } from "../models/tokenFrequency.js";

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
                $out: tokenFrequencySchemaInfo.collectionName,
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
            $addFields:
            /**
             * newField: The new field name.
             * expression: The new field expression.
             */
            {
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
            $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
                from: "tokenFrequency",
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
            $addFields:
            /**
             * newField: The new field name.
             * expression: The new field expression.
             */
            {
                df: "$frequency.documentFrequency",
            },
        },
        {
            $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
                frequency: 0,
            },
        },
        {
            $addFields:
            /**
             * newField: The new field name.
             * expression: The new field expression.
             */
            {
                tfIdf: {
                    $multiply: [
                        "$tf",
                        // Assuming you have a field named "tf" for Term Frequency
                        {
                            $log10: {
                                $divide: [
                                    {
                                        $literal: docCount,
                                    },
                                    // Replace with the total number of documents
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
