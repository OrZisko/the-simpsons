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
export class CommentsListComponent implements OnChanges {
  @Input() comments: number[];
  @Output() onCommentFocus = new EventEmitter<number>();

  commentsToList: Comment[];

  constructor() {}

  ngOnChanges(changes) {
    this.commentsToList = changes.comments.currentValue;
  }
}
