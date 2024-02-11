export const documentProcessStatuses = ["not_processed", "processed", "processing", "error"] as const;

export type DocumentProcessStatuses = typeof documentProcessStatuses[number];

export type Document = {
    crawlerId: string;
    processorId?: string;
    title: string;
    rawContent: string;
    rawHtml: string;
    url: string;
    pageRank: number;
    processStatus: DocumentProcessStatuses;
    createDate: Date;
    processDate?: Date;
}
