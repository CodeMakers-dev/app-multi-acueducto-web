import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE, PRODUCT_CATEGORY } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IProducto } from "@interfaces/Iaccounting";

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {

  private apiUrl = `${environment.apiUrl}/${PRODUCT_CATEGORY.PRODUCT_CATEGORY}`;

  constructor(private http: HttpClient) {}

  getAllProductCategory(): Observable<ApiResponse<IProducto[]>> {
  const url = `${this.apiUrl}/${PRODUCT_CATEGORY.GET_ALL}`;
  return this.http.get<ApiResponse<IProducto[]>>(url);
}
}