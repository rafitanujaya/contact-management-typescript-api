type Paging = {
    current_page: number;
    total_page: number;
    size: number;
}

export type SearchResponse<T> = {
    data: Array<T>;
    paging: Paging
}