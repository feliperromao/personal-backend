export default class HttpLinks {
  static create(resource: string, id: string) {
    return {
      self: {
        href: `/${resource}/${id}`,
        method: "GET",
        type: 'application/json',
      },
      update: {
        href: `/${resource}/${id}`,
        method: "PUT",
        type: 'application/json',
      },
      delete: {
        href: `/${resource}/${id}`,
        method: "DELETE",
      }
    }
  }
}