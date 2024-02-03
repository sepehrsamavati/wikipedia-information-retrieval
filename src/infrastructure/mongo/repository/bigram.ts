import type { Types } from "mongoose";
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
