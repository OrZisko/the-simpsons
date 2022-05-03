import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
})
export class CommentsListComponent {
  @Input() comments: number[];
  @Input() focusedCommentId: number | null;
  @Output() onCommentFocus = new EventEmitter<number>();

  commentsToList: Comment[];

  constructor() {}
}
