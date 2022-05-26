import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  postsChanged = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor() { }

  getPosts() {
    return [...this.posts];
  }

  getPostsChangedListener() {
    return this.postsChanged.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.posts.push(post);
    this.postsChanged.next([...this.posts]);
  }
}
