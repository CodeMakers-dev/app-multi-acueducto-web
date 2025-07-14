import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { ITipoDocumento } from "@interfaces/Iuser";
import { ICorreoPerson } from "@interfaces/Iperson";

@Injectable({
  providedIn: 'root',
})
export class CorreoPersonaService {

  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_ALL_CORREO_PER}`;

  constructor(private http: HttpClient) {}

  getAllTypeDocument(): Observable<ApiResponse<ICorreoPerson[]>> {
    return this.http.get<ApiResponse<ICorreoPerson[]>>(this.apiUrl);
  }
}