import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  /**
   * Retorna un array de IDs del 1 al 100 para prerendering
   * @returns Promise<string[]> Array de IDs como strings
   */
  async getIds(): Promise<string[]> {
    return Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  }
  
}
