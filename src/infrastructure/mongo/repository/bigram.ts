import type { Types } from "mongoose";
import BigramModel from "../models/bigram.js";

export const upsert = async (bigram: string, documentId: Types.ObjectId | string) => {
    try {
        const alreadyAdded = await BigramModel.exists({ value: bigram });
        if (alreadyAdded) {
            const res = await BigramModel.findByIdAndUpdate(alreadyAdded._id, { $push: { documents: documentId } });
            return res !== null;
        } else {
            const res = await BigramModel.create({
                value: bigram,
                documents: [documentId]
            });
            return res !== null;
        }
    } catch {
        return null;
    }
};
