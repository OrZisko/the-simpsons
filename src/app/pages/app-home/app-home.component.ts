import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';
import { CommentsService } from 'src/app/service/comments.service';
import { UsersService } from 'src/app/service/users-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
})
export class AppHomeComponent implements OnInit, OnDestroy {
  currUserSub: Subscription;
  currUser: User;

  commentsSub: Subscription;
  comments$: Observable<Comment[]>;

  mainComments: number[];
  focusedCommentId: number | null = null;

  constructor(
    private userService: UsersService,
    private commentsService: CommentsService
  ) {}

  ngOnInit() {
    this.userService.init();
    this.commentsService.init();
    this.commentsSub = this.commentsService.comments$.subscribe((comments) => {
      this.mainComments = comments
        .filter((comment) => !comment.parentCommentId)
        .map((comment) => comment.id);
    });
    this.currUserSub = this.userService.currUser$.subscribe((user) => {
      this.currUser = user;
    });
  }

  onCommentFocus(commentId: number) {
    this.focusedCommentId = commentId ? commentId : null;
  }

  onAddComment(commentTxt: string) {
    const comment = {
      parentCommentId: this.focusedCommentId,
      ownerId: this.currUser.id,
      ownerName: this.currUser.displayName,
      txt: commentTxt,
      deletedAt: null,
    };
    this.commentsService.addComment(comment);
  }

  ngOnDestroy() {
    this.commentsSub.unsubscribe();
    this.currUserSub.unsubscribe();
  }
}
