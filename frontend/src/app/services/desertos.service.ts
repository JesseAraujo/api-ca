import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Deserto } from "../models/deserto.model";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class DesertosService {
  private readonly domain = "desertos";

  constructor(private readonly api: ApiService) {}

  list(): Observable<Deserto[]> {
    return this.api.get<Deserto[]>(this.domain);
  }

  getById(id: number | string): Observable<Deserto> {
    return this.api.get<Deserto>(this.domain, id);
  }

  create(payload: Partial<Deserto>): Observable<Deserto> {
    return this.api.post<Deserto>(this.domain, payload);
  }

  update(id: number | string, payload: Partial<Deserto>): Observable<Deserto> {
    return this.api.put<Deserto>(this.domain, payload, id);
  }

  remove(id: number | string): Observable<void> {
    return this.api.delete<void>(this.domain, id);
  }
}
