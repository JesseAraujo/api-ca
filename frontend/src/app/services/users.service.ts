import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private readonly domain = "users";

  constructor(private readonly api: ApiService) {}

  list(): Observable<User[]> {
    return this.api.get<User[]>(this.domain);
  }

  getById(id: number | string): Observable<User> {
    return this.api.get<User>(this.domain, id);
  }

  create(payload: Partial<User>): Observable<User> {
    return this.api.post<User>(this.domain, payload);
  }

  update(id: number | string, payload: Partial<User>): Observable<User> {
    return this.api.put<User>(this.domain, payload, id);
  }

  remove(id: number | string): Observable<void> {
    return this.api.delete<void>(this.domain, id);
  }
}
