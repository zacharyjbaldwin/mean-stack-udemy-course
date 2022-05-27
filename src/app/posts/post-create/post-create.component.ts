import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle: string = '';
  enteredContent: string = '';
  isLoading: boolean = false;
  public mode: 'create' | 'edit' = 'create';
  private postId: string;
  public post: Post;
  form: FormGroup;
  imagePreview: string;

  constructor(private postsService: PostsService,
    public route: ActivatedRoute,
    public router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      content: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required], [mimeType])
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        // spinner here
        this.isLoading = true;

        this.postsService.getPost(this.postId)
          .subscribe((post) => {
            // spinner here
            this.isLoading = false;
            this.post = {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            }
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          })
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    } else if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
    this.router.navigate(['/']);
  }

  onImagePicked(event: Event) {
    // const file = (<HTMLInputElement>event.target).files;
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);

    const reader = new FileReader();

    // this is async code
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
