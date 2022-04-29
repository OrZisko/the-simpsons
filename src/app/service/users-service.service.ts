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

  private users: User[];
  public currUserId = 3;

  public init(): void {
    let usersJson = localStorage.getItem(USER_KEY);
    const users = usersJson
      ? JSON.parse(usersJson)
      : require('../../assets/data/users.json');
    localStorage.setItem(USER_KEY, JSON.stringify(users));
    this.users = users;
  }

  public getUserById(id: number): User {
    return this.users.find((user) => user.id === id);
  }
}
