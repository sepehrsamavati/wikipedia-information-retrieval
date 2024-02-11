import type { RequestHandler } from "express";
import stemmer from "../../documentProcess/modules/stemmer.js";
import type { QueryDocuments } from "../../../types/queryDocuments.js";
import { extractPersianWords } from "../../documentProcess/modules/base.js";
import { getDocuments } from "../../../infrastructure/mongo/repository/token.js";

export const queryDocuments: RequestHandler = async (req, res, next) => {
    const body = req.body as QueryDocuments;

    if (!(body?.queryString && typeof body?.doPageRank === "boolean")) return res.status(400).json({ ok: false });

    const queryTokens = extractPersianWords(body.queryString).map(stemmer);
    const result = await getDocuments(queryTokens);

    if (!Array.isArray(result)) return res.json({ ok: false });

    res.json({
        ok: true,
        result
    });
};
