import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Comment } from 'src/app/models/comment';
import { CommentsService } from 'src/app/service/comments.service';
import { UsersService } from 'src/app/service/users-service.service';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() comment: Comment;
  @Input() children: number[];
  @Output() onCommentFocus = new EventEmitter<number>();
  @ViewChild('txt') elTxt: ElementRef;

  commentToShow: Comment;
  childComments: Comment[];
  isByCurrUser: boolean;

  isChildCommentsOpen = false;
  isEditable = false;

  constructor(
    private commentService: CommentsService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.commentToShow = { ...this.comment };
    this.isByCurrUser = this.comment.ownerId === this.userService.currUserId;
  }

  ngOnChanges(changes): void {
    if (changes.children.currentValue !== changes.children.previousValue) {
      this.childComments = this.commentService.getCommentsById(
        this.comment.children
      );
    }
  }

  onToggleChildComments() {
    this.isChildCommentsOpen = !this.isChildCommentsOpen;
  }

  onToggleIsEditable() {
    this.isEditable = !this.isEditable;
  }

  commentFocus(e) {
    e.stopPropagation();
    this.onCommentFocus.emit(this.comment.id);
  }

  onDelete() {
    this.commentService.deleteComment(this.comment.id);
  }

  onUpdate() {
    this.commentToShow.txt = this.elTxt.nativeElement.innerText;
    this.commentService.updateComment(this.commentToShow);
    this.onToggleIsEditable();
  }
}
