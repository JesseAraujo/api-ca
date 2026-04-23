import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Indeferimento } from "../models/indeferimento.model";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class IndeferimentosService {
  private readonly domain = "indeferimentos";

  constructor(private readonly api: ApiService) {}

  list(): Observable<Indeferimento[]> {
    return this.api.get<Indeferimento[]>(this.domain);
  }

  getById(id: number | string): Observable<Indeferimento> {
    return this.api.get<Indeferimento>(this.domain, id);
  }

  create(payload: Partial<Indeferimento>): Observable<Indeferimento> {
    return this.api.post<Indeferimento>(this.domain, payload);
  }

  update(id: number | string, payload: Partial<Indeferimento>): Observable<Indeferimento> {
    return this.api.put<Indeferimento>(this.domain, payload, id);
  }

  remove(id: number | string): Observable<void> {
    return this.api.delete<void>(this.domain, id);
  }
}
