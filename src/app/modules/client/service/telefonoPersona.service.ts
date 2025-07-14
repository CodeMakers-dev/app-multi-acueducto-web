import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { ITipoDocumento } from "@interfaces/Iuser";
import { ICorreoPerson } from "@interfaces/Iperson";
import { ITelefonoPersona } from "@interfaces/ItelefonoPersona";

@Injectable({
  providedIn: 'root',
})
export class TelefonoPersonaService {

  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_ALL_TELEFONO_PER}`;

  constructor(private http: HttpClient) {}

  getAllTelefono(): Observable<ApiResponse<ITelefonoPersona[]>> {
    return this.http.get<ApiResponse<ITelefonoPersona[]>>(this.apiUrl);
  }
}