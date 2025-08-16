import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IInventario } from "@interfaces/Iaccounting";

@Injectable({
  providedIn: 'root',
})
export class InventarioService {

  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_INVENTORY}`;

  protected readonly http = inject(HttpClient);

 getInventarioByEnterprise(): Observable<ApiResponse<IInventario[]>> {
    const enterpriseId = localStorage.getItem('enterpriseId');
    if (!enterpriseId) {
      throw new Error('No se encontró el ID de empresa en el almacenamiento local.');
    }
    const url = `${this.apiUrl}/${END_POINT_SERVICE.GET_ALL_INVENTORY}/${enterpriseId}`;
    return this.http.get<ApiResponse<IInventario[]>>(url);
  }
}