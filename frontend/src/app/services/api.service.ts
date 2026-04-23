import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";

type PathParam = string | number;
type PathParams = PathParam | PathParam[] | undefined;

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private readonly headers = new HttpHeaders({
    "Content-Type": "application/json",
  });
  private readonly baseUrl = `${environment.apiBaseUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  get<T>(domain: string, params?: PathParams): Observable<T> {
    return this.http.get<T>(this.buildUrl(domain, params), { headers: this.headers });
  }

  post<T>(domain: string, data: unknown, params?: PathParams): Observable<T> {
    return this.http.post<T>(this.buildUrl(domain, params), data, { headers: this.headers });
  }

  put<T>(domain: string, data: unknown, params?: PathParams): Observable<T> {
    return this.http.put<T>(this.buildUrl(domain, params), data, { headers: this.headers });
  }

  delete<T>(domain: string, params?: PathParams): Observable<T> {
    return this.http.delete<T>(this.buildUrl(domain, params), { headers: this.headers });
  }

  private buildUrl(domain: string, params?: PathParams): string {
    const suffix = this.normalizeParams(params);
    return suffix ? `${this.baseUrl}/${domain}/${suffix}` : `${this.baseUrl}/${domain}`;
  }

  private normalizeParams(params?: PathParams): string {
    if (params === undefined) {
      return "";
    }

    const parts = Array.isArray(params) ? params : [params];
    return parts.map((value) => encodeURIComponent(String(value))).join("/");
  }
}
