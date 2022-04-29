import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../models/comment';
import { UsersService } from './users-service.service';

declare var require: any;

const COMMENT_KEY = 'appComments';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private userService: UsersService) {}

  private _commantsDB: Comment[];

  private _comments$ = new BehaviorSubject<Comment[]>([]);
  public comments$ = this._comments$.asObservable();

  public init(): void {
    let commetsJson = localStorage.getItem(COMMENT_KEY);
    let comments = commetsJson
      ? JSON.parse(commetsJson)
      : require('../../assets/data/comments.json');
    comments = this._aggregateComments(comments);
    this._setComments(comments);
  }

  public getCommentsById(ids: number[]): Comment[] {
    return ids.map((id) => this.getById(id));
  }

  public getById(id) {
    return this._commantsDB.find((comment) => comment.id === id);
  }

  public addComment(comment) {
    const newComment = {
      ...comment,
      createdAt: Date.now(),
      ownerName: 'Bart Simpson',
      id: this._commantsDB.length + 1,
      children: [],
    };
    this._commantsDB.push(newComment);
    if (newComment.parentCommentId) {
      const idx = this._commantsDB.findIndex(
        (currComment) => newComment.parentCommentId === currComment.id
      );
      this._commantsDB[idx].children.push(newComment.id);
    }
    this._setComments(this._commantsDB);
  }

  public updateComment(comment) {
    const idx = this._commantsDB.findIndex(
      (currComment) => currComment.id === comment.id
    );
    this._commantsDB[idx] = {
      ...comment,
      createdAt: Date.now(),
    };
    this._setComments(this._commantsDB);
  }

  public deleteComment(commentId) {
    const idx = this._commantsDB.findIndex(
      (comment) => comment.id === commentId
    );
    this._commantsDB[idx].deletedAt = Date.now();
    this._commantsDB.splice(idx, 1);
    this._setComments(this._commantsDB);
  }

  private _aggregateComments(comments): Comment[] {
    comments = comments.filter((comment) => !comment.deletedAt);
    comments = comments.map((comment) => {
      const user = this.userService.getUserById(comment.ownerId);
      return {
        ...comment,
        ownerName: user.displayName,
        children: comments
          .filter((currCommnet) => currCommnet.parentCommentId === comment.id)
          .map((currComment) => currComment.id),
        createdAt:
          typeof comment.createdAt === 'number'
            ? comment.createdAt
            : Date.parse(comment.createdAt),
      };
    });
    return comments;
  }

  private _setComments(comments) {
    this._commantsDB = [...comments];
    localStorage.setItem(COMMENT_KEY, JSON.stringify(comments));
    this._comments$.next(comments);
  }
}
