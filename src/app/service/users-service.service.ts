import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

declare var require: any;

const USER_KEY = 'appUsers';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor() {}

  private _users$ = new BehaviorSubject<User[]>([]);
  public users$ = this._users$.asObservable();

  private _currUser$ = new BehaviorSubject<User>(null);
  public currUser$ = this._currUser$.asObservable();

  public init(): void {
    let usersJson = localStorage.getItem(USER_KEY);
    const users = usersJson
      ? JSON.parse(usersJson)
      : require('../../assets/data/users.json');
    localStorage.setItem(USER_KEY, JSON.stringify(users));
    this._users$.next(users);
    this._currUser$.next(users[0]);
  }

  public getUserById(id: number): User {
    return this._users$.getValue().find((user) => user.id === id);
  }

  public changeUser(userId: number) {
    const user = this.getUserById(userId);
    this._currUser$.next(user);
  }
}
