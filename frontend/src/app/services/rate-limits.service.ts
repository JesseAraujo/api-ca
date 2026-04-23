import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RateLimit } from "../models/rate-limit.model";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class RateLimitsService {
  private readonly domain = "rate-limits";

  constructor(private readonly api: ApiService) {}

  list(): Observable<RateLimit[]> {
    return this.api.get<RateLimit[]>(this.domain);
  }

  getOne(scope: string, ipHash: string): Observable<RateLimit> {
    return this.api.get<RateLimit>(this.domain, [scope, ipHash]);
  }

  create(payload: Partial<RateLimit>): Observable<RateLimit> {
    return this.api.post<RateLimit>(this.domain, payload);
  }

  update(scope: string, ipHash: string, payload: Partial<RateLimit>): Observable<RateLimit> {
    return this.api.put<RateLimit>(this.domain, payload, [scope, ipHash]);
  }

  remove(scope: string, ipHash: string): Observable<void> {
    return this.api.delete<void>(this.domain, [scope, ipHash]);
  }
}
