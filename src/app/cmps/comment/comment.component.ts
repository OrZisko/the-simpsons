import { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
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
export class CommentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() commentId: number;
  @Input() focusedCommentId: number | null;
  @Output() onCommentFocus = new EventEmitter<number>();
  @ViewChild('txt') elTxt: ElementRef;

  commentsSub: Subscription;
  userUsb: Subscription;
  comment: Comment;

  isByCurrUser: boolean;
  isChildCommentsOpen = false;
  isEditable = false;
  isFocused = false;

  constructor(
    private commentService: CommentsService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.commentsSub = this.commentService.comments$.subscribe((comments) => {
      this.comment = comments.find(
        (currComment) => currComment.id === this.commentId
      );
    });
    this.userUsb = this.userService.currUser$.subscribe((user) => {
      this.isByCurrUser = this.comment.ownerId === user.id ? true : false;
    });
  }
  ngOnDestroy() {
    this.commentsSub.unsubscribe();
    this.userUsb.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.isFocused =
      changes['focusedCommentId'].currentValue === this.commentId;
  }

  onUpdate(ev: Event) {
    ev.stopPropagation();
    const txt = this.elTxt.nativeElement.innerText;
    this.commentService.updateComment(this.commentId, txt);
    this.onToggleIsEditable(null);
  }
  onDelete(ev: Event) {
    ev.stopPropagation();
    this.commentService.deleteComment(this.commentId);
  }

  commentFocus(e: Event) {
    e.stopPropagation();
    this.onCommentFocus.emit(this.commentId);
  }

  onToggleChildComments() {
    this.isChildCommentsOpen = !this.isChildCommentsOpen;
  }
  onToggleIsEditable(ev: Event) {
    if (ev) ev.stopPropagation();
    this.isEditable = !this.isEditable;
    this.isEditable
      ? this.elTxt.nativeElement.classList.add('focus')
      : this.elTxt.nativeElement.classList.remove('focus');
  }
}
