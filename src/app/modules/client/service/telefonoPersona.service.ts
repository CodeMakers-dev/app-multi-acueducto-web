import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { ITipoDocumento } from "@interfaces/Iuser";
import { ICorreoPerson } from "@interfaces/Iperson";
import { ITelefonoGeneral } from "@interfaces/ItelefonoGeneral";

@Injectable({
  providedIn: 'root',
})
export class TelefonoGeneralService {

  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_ALL_TELEFONO_PER}`;

  constructor(private http: HttpClient) {}

  getAllTelefono(): Observable<ApiResponse<ITelefonoGeneral[]>> {
    return this.http.get<ApiResponse<ITelefonoGeneral[]>>(this.apiUrl);
  }
}