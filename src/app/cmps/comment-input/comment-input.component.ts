import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/service/users-service.service';

@Component({
  selector: 'comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss'],
})
export class CommentInputComponent implements OnInit, OnDestroy {
  @Output() onAddComment = new EventEmitter<string>();
  userSub: Subscription;
  currUserId: number;

  constructor(private userService: UsersService) {}

  commentTxt = '';

  ngOnInit(): void {
    this.userSub = this.userService.currUser$.subscribe((user) => {
      this.currUserId = user.id;
    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  addComment() {
    this.onAddComment.emit(this.commentTxt);
    this.commentTxt = '';
  }
  prevent(e: Event) {
    e.stopPropagation();
  }
}
