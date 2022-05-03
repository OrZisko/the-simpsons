import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/service/users-service.service';

@Component({
  selector: 'user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.scss'],
})
export class UserPortalComponent implements OnInit, OnDestroy {
  constructor(private userService: UsersService) {}

  usersSub: Subscription;
  currUserSub: Subscription;
  users: User[];
  currUser: User;

  ngOnInit(): void {
    this.usersSub = this.userService.users$.subscribe((users) => {
      this.users = users;
    });
    this.currUserSub = this.userService.currUser$.subscribe((user) => {
      this.currUser = user;
    });
  }
  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
    this.currUserSub.unsubscribe();
  }

  onChangeUser(id: string) {
    this.userService.changeUser(+id);
  }
}
