import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ISocial } from 'src/app/models/isocial';
import { ProfileUser } from 'src/app/models/user';
import { ImageUploadService } from 'src/app/services/image-upload.service';

import { UserCat, UserRole, UserRoles } from '../Enums/usre-cat';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Post,Comment,Like } from 'src/app/models/Post';
import { catchError, EMPTY, filter, firstValueFrom, forkJoin, from, map, mergeMap, Observable, of, Subject, Subscription, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { DocumentSnapshot, FieldValue, Timestamp, updateDoc } from 'firebase/firestore';
import { RSA_NO_PADDING } from 'constants';
import { arrayUnion, doc, getDoc } from '@angular/fire/firestore';
import { SocialService } from 'src/app/services/social.service';


@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css']
})
export class SocialMediaComponent implements OnInit // , OnDestroy 
{
  constructor(
    private readonly router: Router,
    private readonly route : ActivatedRoute,
    private userService: SocialService,
    private imageUploadService: ImageUploadService,
    private readonly fb: NonNullableFormBuilder,
   private readonly firestore: AngularFirestore,
    private toast: HotToastService
  ) { }
  soc: (ISocial|null|undefined)
  //socID: string = ""
  isTeacher = (num:UserCat):boolean =>num===UserCat.معلم
  students: (ProfileUser[] | undefined);
  user: ProfileUser|undefined|null;
 
  posts: (Post[] | undefined) ;
  image :File | null = null;
   imageUrl: string | ArrayBuffer | null = null;
commentForms: Map<string,FormGroup<{ content: FormControl<string>;}>> = new Map<string,FormGroup<{ content: FormControl<string>;}>>();
// { [postId: string]: FormGroup<{ content: FormControl<string>;}> } = {};

 postForm = this.fb.group<{
    content: FormControl<string | null>;
    postImage: FormControl<File | null>;
}>({
  content: new FormControl<string>('', [Validators.required]),
  postImage: new FormControl<File>(null!,[Validators.nullValidator])
});
//  isTeacher$ = this.userService.isTeacher$
  user$ = this.userService.currentUserProfile$;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  //  userNameFromId(id: string) {
  //  return this.userService.getUser(id).pipe(filter((v)=>v!==null)).pipe(map((user) => user?.displayName));
  // }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      console.log(file);
      this.image = file;
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result; // This will be the image preview URL
        console.log(this.imageUrl);
      };

      reader.readAsDataURL(file); // Convert the file into base64 to display as an image
    }
  }
  ngOnInit(): void {
    const id = <string>this.route.snapshot.params['id'] ;
    console.log(id);
        this.userService
   .getSocietyById(id)
   .subscribe(society => {
     if (!society) {
    this.router.navigate(['/notFound']);
    return;
  }
  this.soc = society;
   console.log(society);

  this.user$
  .subscribe((user)=>{
    this.user = user;
    console.log(user);
  })


  // this.userService.getTeacherBySocietyId(society.socialID).subscribe((teacher)=>{
  //   this.userService.getUser(teacher!).subscribe((res)=>{
  //     this.teacher = res;
  //     console.log(res);
  //   })
  // })


//ajax call
  this.userService.getAllUsers(UserCat.طالب, society.socialID , true).subscribe((res)=>{
    this.students = res;
    console.log(res);
  });

  from(this.firestore.collection<Omit<Post,'postId'>>('posts', ref => ref.where('societyId', '==', society.socialID).orderBy('createdAt', 'desc')).get())
    //.snapshotChanges()
    .pipe(map(snaps => snaps.docs.map(s => (<Post>{
      postId: s.id ,
      ... s.data() 
    }))))
    .subscribe(posts => {
      console.log(posts);
     posts.forEach(p=>p.comments.reverse());
      this.posts = posts;
      this.posts.forEach(p => {
        if (!this.commentForms.has(p.postId)) {
          this.commentForms.set(p.postId
            ,new FormGroup<{ content: FormControl<string>;}>
            ({ content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }) }));
       }
       // posts.map(p=>p.comments).sort().

        // this.firestore.collection(`posts/${p.id}/comments`, ref => ref.orderBy('createdAt'))
        //   .valueChanges()
        //   .subscribe(comments=> p.comments = <Comment[]>comments);
      });
    });


});



 }

//private destroy$ = new Subject<void>();
//private commentSubscriptions = new Map<string, Subscription>();

// ngOnInit(): void {
// const id = <string>this.route.snapshot.params['id'];

//   this.userService.getSocietyById(id).pipe(
//     takeUntil(this.destroy$),
//     switchMap(society => {
//       if (!society) {
//         this.router.navigate(['/notFound']);
//         return EMPTY;
//       }

//       this.soc = society;

//       // Combine all parallel calls
//       return forkJoin({
//         user: this.userService.currentUserProfile$,
//         teacherId: this.userService.getTeacherBySocietyId(society.socialID),
//         students: this.userService.getAllUsers(UserCat.طالب, society.socialID, true),
//         posts: this.firestore.collection('posts', ref =>
//           ref.where('societyId', '==', society.socialID)
//              .orderBy('createdAt', 'desc')
//         ).snapshotChanges().pipe(
//           map(snaps => snaps.map(s => ({
//            // id: s.payload.doc.id,
//             ...(s.payload.doc.data() as Post)
//           })))
//         )
//       }).pipe(
//         switchMap(data =>
//           this.userService.getUser(data.teacherId!).pipe(
//             map(teacher => ({ ...data, teacher }))
//           )
//         )
//       );
//     })
//   ).subscribe(({ user, teacher, students, posts }) => {
//     console.log(user, teacher, students, posts);
//     this.user = user;
//     this.teacher = teacher;
//     this.students = students;
//     this.posts = posts;

//     this.initCommentFormsAndSubscriptions(posts);
//   });
// }


// private initCommentFormsAndSubscriptions(posts: Post[]) {
//   posts.forEach(post => {
//     // Form init
//     if (!this.commentForms[post.postId]) {
//       this.commentForms[post.postId] = this.fb.group({
//         content: ['', Validators.required]
//       });
//     }

//     // Comment subscription management
//     const comments$ = this.firestore
//       .collection<Comment>(`posts/${post.postId}/comments`, ref =>
//         ref.orderBy('createdAt')
//       )
//       .valueChanges();

//     const sub = comments$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(comments => {
//         post.comments = comments;
//       });

//     this.commentSubscriptions.set(post.postId, sub);
//   });
// }

// ngOnDestroy(): void {
//   this.destroy$.next();
//   this.destroy$.complete();

//   // Cleanup comment subscriptions if needed
//   this.commentSubscriptions.forEach(sub => sub.unsubscribe());
//   this.commentSubscriptions.clear();
// }



addComment(postId: string, studentId: string, studentName: string) {
  const content = this.commentForms.get(postId)?.value.content;
  if (!content) return;
  const comment : Comment = {
    creator: studentName,
    studentId: studentId,
    content,
    createdAt: Timestamp.now()
  };
  const Ref = this.firestore.collection<Omit<Post,'postId'>>('posts').doc(postId);
 // const postRef = doc<Omit<Post,'postId'>>(Ref.doc(postId).ref);
  //console.log( postRef);
  from(//this.firestore.collection<Comment>(`posts/${postId}/comments`).add(comment)
    Ref.get()
).pipe(
    //map(res=>res.get()),
    switchMap(res=> of(res.ref)),
    switchMap(res=> updateDoc<Omit<Post,'postId'>>(res, {comments  : arrayUnion(comment)})),
    switchMap(()=> Ref.get() 

   //from( getDoc(Ref.ref))     
    ),
    //switchMap(()=> from(getDoc(postRef.doc(postId).ref))),
    map(res=>(res&&res.exists&&res.id&&res.id === postId&&res.data()&&res.data()?.comments&&res.data()?.comments.length)?(<Post>{...res.data(),postId:res.id}):null),
    mergeMap(post=>post?of(post):throwError(() => new Error('Post not found'))),
    map(post=>post.comments),
    // tap(c=>
    //    {
       

    //    }
      
    //  )
//,
    // map(res=>(res.exists&&res.id&&res.data())?(<Comment>{...res.data()}):null),
    // mergeMap(comment=>comment?of(comment):throwError(() => new Error('Comment not found')))
  )
  //.pipe( take(1))
  .subscribe(
    (res)=>{
           const localPost = this.posts?.find(p => p.postId === postId);
     
        if (localPost&&localPost.comments) {
          localPost.comments = res;
          localPost.comments.reverse();
          if(this.posts?.find(p => p.postId === postId)) {
        this.posts.find(p => p.postId === postId)!.comments = localPost.comments;
        let a  = this.posts.find(p => p.postId === postId)!.comments
          console.log(a);
          
          }
          console.log(localPost.comments);
        } 
     this.commentForms.get(postId)?.reset({content: ''}); 
     //this.posts?.find(p => p.postId === postId)!.comments.push(res);
    }
  )
  //   {next: res => {
   
  //    const localPost = this.posts?.find(p => p.postId === postId);
     
  //       if (localPost&&localPost.comments) {
  //         localPost.comments = res;
  //         localPost.comments.reverse();
  //         if(this.posts?.find(p => p.postId === postId)) {
  //       this.posts.find(p => p.postId === postId)!.comments = localPost.comments;
  //       let a  = this.posts.find(p => p.postId === postId)!.comments
  //         console.log(a);
          
  //         }
  //         console.log(localPost.comments);
  //       } 
  //    this.commentForms.get(postId)?.reset({content: ''}); 
  //    //this.posts?.find(p => p.postId === postId)!.comments.push(res);
  // } , error: err => console.error(' Error adding comment',err)});
  // .then(() => {
  //   this.commentForms[postId].reset();
  // });
}

likePost(postId: string, studentId: string, studentName: string) {
  const alreadyLiked = this.posts?.find(p => p.postId === postId)?.likes.some(like => like.studentId === studentId);
if (alreadyLiked) {
  console.warn('Already liked');
  return;
}
  const like :Like= {
    creator:studentName,
    studentId:studentId,
    createdAt: Timestamp.now()
  };
 const Ref = this.firestore.collection<Omit<Post,'postId'>>('posts').doc(postId); 
 from(// this.firestore.collection<Like>(`posts/${postId}/likes`).add(like)
 Ref.get()
).
 pipe(
   //switchMap(res=> from(res.get())),
      switchMap(res=> of(res.ref)),
    switchMap(res=> updateDoc<Omit<Post,'postId'>>(res, {likes  : arrayUnion(like)})),
    switchMap(()=> //from(getDoc(Ref.ref))
    Ref.get()
  ),
   map(res=>(res.exists&&res.id&&res.data()&&res.id === postId && res.data()?.likes&&res.data()?.likes.length)?(<Post>{...res.data(),postId:res.id}):null),
   mergeMap(post=>post?of(post):throwError(() => new Error('Post not found'))),
   map(post=>post.likes),
    tap(l=>
       {
        const localPost = this.posts?.find(p => p.postId === postId);
        if (localPost&&localPost.likes) {
          localPost.likes = l;
          localPost.likes.reverse();
        } 

       }
      
     )
,
)
 .subscribe(//res=>this.posts?.find(p => p.postId === postId)!.likes.push(res)

  {next: res => {console.log(res);
    //this.posts?.find(p => p.postId === postId)!.likes.push(res);
  } , error: err => console.error(' Error adding like',err)}
);
}
createPost(soc:ISocial) {
  const content = this.postForm.value.content;
  if (!content) return;
  const newPost: Omit<Post, 'postId'> = {
    content: content,
    teacherId: soc.uid,
    societyId: soc.socialID,
    createdAt: Timestamp.now(),
    creator: soc.creator,
    comments:new Array<Comment>(0),
    likes: new Array<Like>(0)
  };
 
  if(this.image===null) {
    console.log('no image');
    from(this.firestore.collection<Omit<Post,'postId'>>('posts').add(newPost))
  .pipe(switchMap(res=> from(res.get())),
  map(res=>(res.exists&&res.id&&res.data())?(<Post>{...res.data(),postId:res.id}):null),
  mergeMap(post=>post?of(post):throwError(() => new Error('Post not found')))
).subscribe({

    next: res => {
      this.postForm.reset();
      this.posts?.unshift({
        ...newPost,
        postId: res.postId
      });
      this.commentForms.set(res.postId, new FormGroup<{ content: FormControl<string>;}>
            ({ content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }) })) ;
            this.imageUrl = null;
            this.image = null;
    },

    error: err => console.error('Error adding post', err)
  });
  }
   //  this.postForm.patchValue({
    //     postImage:this.image
    //   });

   // console.log(this.postForm.get('postImage')?.value)
    //if(!this.postForm.get('postImage')?.value) return;
 else{
    console.log( this.image); 
   
  this.uploadPostImage(this.image)?.subscribe({
    next: res => {
      newPost.mediaUrl = res;
from(this.firestore.collection<Omit<Post,'postId'>>('posts').add(newPost))
  .pipe(switchMap(res=> from(res.get())),
  map(res=>(res.exists&&res.id&&res.data())?(<Post>{...res.data(),postId:res.id}):null),
  mergeMap(post=>post?of(post):throwError(() => new Error('Post not found')))
).subscribe({

    next: res => {
      this.postForm.reset();

      this.posts?.unshift({
        ...newPost,
        postId: res.postId
      });
      this.commentForms.set(res.postId, new FormGroup<{ content: FormControl<string>;}>
            ({ content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }) })) ;
            this.imageUrl = null;
            this.image = null;
    },

    error: err => console.error('Error adding post', err)
  });
    },
    error: err => console.error('Error uploading image', err)
  });
 }
  
}

uploadPostImage(file: File) {
   const form = new FormData();
  //   const input = event.target as HTMLInputElement;
  //   if(!input.files|| input.files.length === 0) return;
  if(!file||file.size === 0||file.type !== 'image/jpeg') return ;
    //const file = input.files[0];
    console.log(file);
    form.append("file", file);
    form.append("api_key", '692369785745284');
    form.append("api_secret", 'gOfP7XJmRMWk31Jn63CnuWc0X1g');
    form.append("upload_preset", "hellohello");
    form.append("cloud_name", "dcadewwme");

    return this.imageUploadService
      .uploadImage(form)
      .pipe(
        this.toast.observe({
          loading: 'Uploading Post image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
      ).pipe(
        map(res => <string>res.url)
      )
      //  .subscribe({
      //    next: data1 => {
      //      console.log(data1);
      //      return <string>data1.url;
      //    },
      //    error: err => {
      //      console.error('Error uploading post image', err);
      
      //    },
      //  })
       
      
      
}
  uploadFile(event: Event, isProfile: boolean, socialID = this.soc!.socialID) {
    const form = new FormData();
    const input = event.target as HTMLInputElement;
    if(!input.files|| input.files.length === 0) return;
    const file = input.files[0];
    form.append("file", file);
    form.append("api_key", '692369785745284');
    form.append("api_secret", 'gOfP7XJmRMWk31Jn63CnuWc0X1g');
    form.append("upload_preset", "hellohello");
    form.append("cloud_name", "dcadewwme");

    this.imageUploadService
      .uploadImage(form)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
      )
      .subscribe((data1) => {
        console.log('dkdldldlkdl')
        console.log(data1);
        var socialProfileImg = "";
        var socialBackImg = "";
        if (isProfile == true) {
          socialProfileImg = data1.url;
          this.userService.updateSociety(socialID,{socialProfileImg}).subscribe(() => {
            window.location.reload();
          });
        } else {
          socialBackImg = data1.url
          this.userService.updateSociety(socialID,{

            socialBackImg
          }).subscribe(() => {
            window.location.reload();
          });
        }


      });
  }

}
