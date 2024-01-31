export const crawlStatuses = ["not_visited", "visited", "in_progress", "error"] as const;

export type UrlCrawlStatus = typeof crawlStatuses[number];

export type UrlFrontierUrl = {
    parentUrl?: string;
    linkedBy: string[];
    crawlerId?: string;
    url: string;
    priority?: number;
    depth: number;
    status: UrlCrawlStatus;
    createDate: Date;
    visitedDate?: Date;
}
