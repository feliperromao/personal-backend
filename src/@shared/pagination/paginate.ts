import Pagination from "./pagination.interface";

export default class Paginate {
  static create(resource: string, data: any[], total: number, page: number, limit: number): Pagination {
    const totalPages = Math.ceil(total / limit);
    const resource_uri = `${process.env.APP_URL}/${resource}`
    const first_page_url = `${resource_uri}?page=1`
    const last_page_url =  `${resource_uri}?page=${totalPages}`
    const next_page_url = (totalPages > 1) ? `${resource_uri}?page=${page + 1}` : ''
    return {
      data: data,
      current_page: page,
      first_page_url: first_page_url,
      last_page_url: last_page_url,
      last_page: totalPages,
      next_page_url: next_page_url,
      per_page: limit,
      total_documents: total
    }
  }
}