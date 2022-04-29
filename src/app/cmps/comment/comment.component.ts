import { OnDestroy } from '@angular/core';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { CommentsService } from 'src/app/service/comments.service';
import { UsersService } from 'src/app/service/users-service.service';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() commentId: number;
  @Output() onCommentFocus = new EventEmitter<number>();
  @ViewChild('txt') elTxt: ElementRef;

  commentsSub: Subscription;
  comment: Comment;

  isByCurrUser: boolean;
  isChildCommentsOpen = false;
  isEditable = false;

  constructor(
    private commentService: CommentsService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.commentsSub = this.commentService.comments$.subscribe((comments) => {
      this.comment = comments.find(
        (currComment) => currComment.id === this.commentId
      );
      if (this.comment.ownerId === this.userService.currUserId)
        this.isByCurrUser = true;
    });
  }
  ngOnDestroy() {
    this.commentsSub.unsubscribe();
  }

  onUpdate() {
    const txt = this.elTxt.nativeElement.innerText;
    this.commentService.updateComment(this.commentId, txt);
    this.onToggleIsEditable();
  }
  onDelete() {
    this.commentService.deleteComment(this.commentId);
  }

  commentFocus(e) {
    e.stopPropagation();
    this.onCommentFocus.emit(this.commentId);
  }

  onToggleChildComments() {
    this.isChildCommentsOpen = !this.isChildCommentsOpen;
  }
  onToggleIsEditable() {
    this.isEditable = !this.isEditable;
  }
}
