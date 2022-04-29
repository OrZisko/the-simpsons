import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { CommentsService } from 'src/app/service/comments.service';
import { UsersService } from 'src/app/service/users-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
})
export class AppHomeComponent implements OnInit, OnDestroy {
  mainComments: Comment[];
  comments: Comment[];
  comments$: Observable<Comment[]>;
  commentsSub: Subscription;
  focusedCommentId: number | null = null;

  constructor(
    private userService: UsersService,
    private commentsService: CommentsService
  ) {}

  ngOnInit() {
    this.userService.init();
    this.commentsService.init();
    this.commentsSub = this.commentsService.comments$.subscribe((comments) => {
      this.mainComments = comments.filter(
        (comment) => !comment.parentCommentId
      );
    });
  }

  onCommentFocus(commentId) {
    this.focusedCommentId = commentId ? commentId : null;
  }

  onAddComment(commentTxt) {
    const comment = {
      parentCommentId: this.focusedCommentId,
      ownerId: this.userService.currUserId,
      txt: commentTxt,
      deletedAt: null,
    };
    this.commentsService.addComment(comment);
  }

  ngOnDestroy() {
    this.commentsSub.unsubscribe();
  }
}
