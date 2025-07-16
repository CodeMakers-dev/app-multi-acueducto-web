import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { ITipoDocumento } from "@interfaces/Iuser";
import { ITipoDeuda } from "@interfaces/IdeudaFactura";

@Injectable({
  providedIn: 'root',
})
export class TipoDeudaService {

  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_ALL_TIPO_DEUDA}`;

  constructor(private http: HttpClient) {}

  getAllTipoDeuda(): Observable<ApiResponse<ITipoDeuda[]>> {
    return this.http.get<ApiResponse<ITipoDeuda[]>>(this.apiUrl);
  }
}