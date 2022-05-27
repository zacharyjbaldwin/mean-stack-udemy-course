import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  postsChanged = new Subject<{ posts: Post[], postCount: number }>();
  private posts: Post[] = [];

  constructor(private http: HttpClient) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParms = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, maxPosts: number, posts: {title: string, content: string, _id: string, imagePath: string}[]}>(`http://localhost:3000/api/posts${queryParms}`)
      .pipe(map((res) => {
        return {
          posts: res.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          maxPosts: res.maxPosts }
      }))
      .subscribe((res) => {
        this.posts = res.posts;
        this.postsChanged.next({
          posts: [...this.posts],
          postCount: res.maxPosts
        });
      });
  }

  getPostsChangedListener() {
    return this.postsChanged.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        // const post: Post = {
        //   id: res.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: res.post.imagePath
        // }
        // this.posts.push(post);
        // this.postsChanged.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`);
      // .subscribe((res) => {
      //   console.log(`Post with id ${id} deleted.`);
      //   const updatedPosts = this.posts.filter((post) => post.id !== id);
      //   this.posts = updatedPosts;
      //   this.postsChanged.next(updatedPosts);
      // });
  }

  getPost(id: string) {
    // return {...this.posts.find((p) => p.id === id)};
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content),
      postData.append('image', image, title);
    } else {
      // send normal json data
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((res) => {
        // // console.log(res);
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: ""
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsChanged.next([...this.posts]);
      });
  }
}
