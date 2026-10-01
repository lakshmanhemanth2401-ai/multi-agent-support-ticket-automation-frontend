export interface PageMetadata { offset: number; limit: number; total: number }
export interface Page<T> { items: T[]; pagination: PageMetadata }
