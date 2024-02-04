import type { Types } from "mongoose";
import config from "../../../config.js";
import BigramModel from "../models/bigram.js";

export const upsert = async (bigram: [string, string], documentId: Types.ObjectId | string) => {
    try {
        const alreadyAdded = await BigramModel.exists({ start: bigram[0], end: bigram[1] });
        if (alreadyAdded) {
            const res = await BigramModel.findByIdAndUpdate(alreadyAdded._id, { $push: { documents: documentId } });
            return res !== null;
        } else {
            const res = await BigramModel.create({
                start: bigram[0],
                end: bigram[1],
                documents: [documentId]
            });
            return res !== null;
        }
    } catch {
        return null;
    }
};

export const guessText = async (bigram: [string?, string?]) => {
    try {
        const [start, end] = bigram;
        const filter: { start?: string; end?: string; } = {};

        if (!start)
            filter.start = config.bigramStopChar;
        else {
            filter.start = start;
            filter.end = end ?? config.bigramStopChar;
        }

        const res: { _id: Types.ObjectId; start: string; end: string; score: number; }[] = await BigramModel.aggregate([
            {
                $match: filter,
            },
            {
                $addFields: {
                    score: {
                        $size: "$documents",
                    },
                },
            },
            {
                $project: {
                    start: 1,
                    end: 1,
                    score: 1,
                },
            },
            {
                $sort: {
                    score: -1,
                },
            },
            {
                $limit: 5,
            },
        ]).exec();
        return res.map(({ start, end, score }) => ({ start, end, score }));
    } catch {
        return null;
    }
};
