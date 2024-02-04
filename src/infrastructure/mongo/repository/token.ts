import type { Types } from "mongoose";
import TokenModel from "../models/token.js";

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
                    docScore: {
                        $size: "$documents",
                    },
                },
            },
            {
                $sort: {
                    docScore: -1,
                },
            },
            {
                $project: {
                    docScore: 1,
                    uniqueDocuments: {
                        $setUnion: ["$documents"],
                    },
                },
            },
            {
                $addFields: {
                    repoScore: {
                        $size: "$uniqueDocuments",
                    },
                },
            },
            {
                $out: "tokenFrequency",
            },
        ]);
        return true;
    } catch (e) {
        console.error(e);
        return null;
    }
};
