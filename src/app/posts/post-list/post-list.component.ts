import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/posts/post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsChangedSubscription: Subscription;
  public isLoading: boolean = false;

  // pagination settings
  public totalPosts: number = 0;
  public postsPerPage: number = 2;
  public pageSizeOptions: number[] = [1, 2, 5, 10];
  public currentPage: number = 1;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsChangedSubscription = this.postsService.getPostsChangedListener().subscribe((postData: {
      posts: Post[],
      postCount: number
    }) => {
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.postsChangedSubscription.unsubscribe();
  }

  onDeletePost(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  public onChangedPage(event: PageEvent) {
    // console.log(event);
    this.isLoading = true;

    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
