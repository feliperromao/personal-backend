export default interface Pagination {
  current_page: number;
  data: any[];
  first_page_url: string;
  last_page: number;
  last_page_url?: string;
  next_page_url?: string;
  prev_page_url?: string;
  per_page: number;
  total_documents: number;
}