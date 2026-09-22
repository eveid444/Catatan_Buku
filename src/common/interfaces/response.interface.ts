export interface IResponseEntity<T> {
  code: number;
  status: boolean;
  message: string;
  data?: T;
  meta?: ImetaPagination;
}

export interface ImetaPagination {
  totalPages: number;
  totalData: number;
  totalDataPerPage: number;
  page: number;
  limit: number;
}

export interface IResponsePageWrapper<T> {
  data: T[];
  meta: ImetaPagination;
}