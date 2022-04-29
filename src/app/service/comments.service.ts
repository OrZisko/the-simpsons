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
    let comments: Comment[];
    if (commetsJson) {
      comments = JSON.parse(commetsJson);
    } else {
      comments = require('../../assets/data/comments.json');
      comments = this._aggregateComments(comments);
    }
    this._commantsDB = this._aggregateComments(comments);
    this._setComments(this._commantsDB);
  }

  public getCommentsById(ids: number[]): Comment[] {
    return ids.map((id) => this.getById(id));
  }

  public getById(id: number) {
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

  public updateComment(id: number, txt: string) {
    const idx = this._commantsDB.findIndex(
      (currComment) => currComment.id === id
    );
    this._commantsDB[idx] = {
      ...this._commantsDB[idx],
      txt: txt,
      createdAt: Date.now(),
    };
    this._setComments(this._commantsDB);
  }

  public deleteComment(commentId: number) {
    const idx = this._commantsDB.findIndex(
      (comment) => comment.id === commentId
    );
    const comment = this._commantsDB[idx];
    comment.deletedAt = Date.now();
    if (comment.parentCommentId) {
      const parentComment = this._commantsDB.find(
        (currComment) => currComment.id === comment.parentCommentId
      );
      parentComment.children = parentComment.children.filter(
        (childId) => childId !== commentId
      );
    }
    this._commantsDB.splice(idx, 1);
    this._setComments(this._commantsDB);
  }

  private _aggregateComments(comments: Comment[]): Comment[] {
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

  private _setComments(comments: Comment[]) {
    localStorage.setItem(COMMENT_KEY, JSON.stringify(comments));
    this._comments$.next(comments);
  }
}
