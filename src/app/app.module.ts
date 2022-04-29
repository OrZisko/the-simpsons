import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppHomeComponent } from './pages/app-home/app-home.component';
import { CommentComponent } from './cmps/comment/comment.component';
import { CommentInputComponent } from './cmps/comment-input/comment-input.component';
import { FormsModule } from '@angular/forms';
import { CommentsListComponent } from './cmps/comments-list/comments-list.component';
import { TimeDescPipe } from './pipes/time-desc.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AppHomeComponent,
    CommentComponent,
    CommentInputComponent,
    CommentsListComponent,
    TimeDescPipe,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
