export const crawlStatuses = ["not_visited", "visited", "in_progress", "error"] as const;

type UrlCrawlStatus = typeof crawlStatuses[number];

export type UrlFrontierUrl = {
    url: string;
    priority?: number;
    depth: number;
    status: UrlCrawlStatus;
    createDate: Date;
    visitedDate?: Date;
}
