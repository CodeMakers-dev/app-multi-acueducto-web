import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IProducto } from "@interfaces/Iaccounting";

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_PRODUC}`;

  constructor(private http: HttpClient) {}

  getProductByIdEnterprise(enterpriseId: number): Observable<ApiResponse<IProducto[]>> {
  const url = `${this.apiUrl}/${END_POINT_SERVICE.GET_ALL_PRODUC}/${enterpriseId}`;
  return this.http.get<ApiResponse<IProducto[]>>(url);
}
}