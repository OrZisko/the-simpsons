import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsersService } from 'src/app/service/users-service.service';

@Component({
  selector: 'comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss'],
})
export class CommentInputComponent implements OnInit {
  @Output() onAddComment = new EventEmitter<string>();

  constructor(private userService: UsersService) {}

  currUserId: number;
  commentTxt = '';

  ngOnInit(): void {
    this.currUserId = this.userService.currUserId;
  }
  prevent(e) {
    e.stopPropagation();
  }
}
