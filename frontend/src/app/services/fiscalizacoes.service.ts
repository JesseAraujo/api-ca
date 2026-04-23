import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Fiscalizacao } from "../models/fiscalizacao.model";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class FiscalizacoesService {
  private readonly domain = "fiscalizacoes";

  constructor(private readonly api: ApiService) {}

  list(): Observable<Fiscalizacao[]> {
    return this.api.get<Fiscalizacao[]>(this.domain);
  }

  getById(id: number | string): Observable<Fiscalizacao> {
    return this.api.get<Fiscalizacao>(this.domain, id);
  }

  create(payload: Partial<Fiscalizacao>): Observable<Fiscalizacao> {
    return this.api.post<Fiscalizacao>(this.domain, payload);
  }

  update(id: number | string, payload: Partial<Fiscalizacao>): Observable<Fiscalizacao> {
    return this.api.put<Fiscalizacao>(this.domain, payload, id);
  }

  remove(id: number | string): Observable<void> {
    return this.api.delete<void>(this.domain, id);
  }
}
