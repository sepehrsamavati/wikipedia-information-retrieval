import UrlFrontierModel from "../models/urlFrontier.js";
import type { UrlFrontierUrl } from "../../../types/entities/urlFrontier";

export const add = async (url: UrlFrontierUrl) => {
    try {
        const res = await UrlFrontierModel.create(url);
        return true;
    } catch {
        return false;
    }
};