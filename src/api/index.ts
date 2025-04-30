import { AuthorsApi, BooksApi } from 'api/portal-api';
import { AxiosInstance } from 'axios';

let $AuthorsApi: AuthorsApi;
let $BooksApi: BooksApi;

export default function (axiosInstance: AxiosInstance) {
  $BooksApi = new BooksApi(undefined, '', axiosInstance);
  $AuthorsApi = new AuthorsApi(undefined, '', axiosInstance);
}

export { $AuthorsApi, $BooksApi };
