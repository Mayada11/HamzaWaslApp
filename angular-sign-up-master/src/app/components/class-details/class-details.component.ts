import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IClassList } from 'src/app/models/iclass-list';
import { ClassListServiceService } from 'src/app/services/class-list-service.service';
import { UsersService } from 'src/app/services/users.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { and } from 'firebase/firestore';
@UntilDestroy()
@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent implements OnInit {
   user$ = this.usersService.currentUserProfile$;
  classList:IClassList | null = null;
  recievedUserId?:string = '';
  sameUser:boolean=false
  materials:any
  showInput = false;       // عشان نتحكم في ظهور أو إخفاء ال input
    showBook = false;       // عشان نتحكم في ظهور أو إخفاء ال input
    showExam = false;  
    showGame = false     // عشان نتحكم في ظهور أو إخفاء ال input

  videoURL:string='';
  gamesUrls:string='';
  examUrls:string='';
  booksUrls:string='';
materialsId:string=''
constructor(private activatedRoute:ActivatedRoute,private router:Router,private usersService:UsersService,    private toast: HotToastService
){
}
ngOnInit(): void {
  //id of table lesson teacher
  var documentID = this.activatedRoute.snapshot.paramMap.get('dId');
  //id of creator 
  var recievedUserId = localStorage.getItem('userCreatedId')
  
  this.usersService.currentUserProfile$
  .pipe(untilDestroyed(this), tap(console.log)).subscribe((user) => {
    if(recievedUserId == user.uid){
      this.sameUser = true
    }else{this.sameUser = false}
    if(documentID!=null)
    this.usersService.getTeacherLessonById(documentID).subscribe(data=>{
      this.materials = data;
      console.log(this.materials)
    //    if(this.materials == undefined && documentID!=undefined){
    //   this.usersService.addMaterial({chapterId:documentID}).subscribe(e=>{
    //       this.materialsId = e['id'];
    //       localStorage.setItem('materialId',e['id']);
    //     })
    // }
    })
  })
}

showVideo(videoUrl?:string){
  if(videoUrl!=null){
    localStorage.setItem("videoURL",videoUrl);
    this.router.navigate(['/classVideo']);
  }
  
}
toggleInput() {
    this.showInput = !this.showInput;
  }
  toggleInputBook() {
    this.showBook = !this.showBook;
  }
  toggleInputExam() {
    this.showExam = !this.showExam;
  }
  toggleInputGame() {
    this.showGame = !this.showGame;
  }
  addVideoUrl() {
    if(this.videoURL == undefined || this.videoURL.length==0){
      return
    }
     var materialsId = this.activatedRoute.snapshot.paramMap.get('dId');
     console.log(materialsId)
     if(materialsId != null)
    this.usersService.addVideoUrl(materialsId,this.videoURL).pipe(
       this.toast.observe({
              success: ' تم اضافة الفيديو بنجاح  ',
              loading: 'جاري التحميل .....',
              error: ({ message }) => `${message}`,
      })
    ).subscribe({next: (updatedData) => {
    console.log('📚 Updated Material:', updatedData);
    this.materials = updatedData; // أو استخدميها في الواجهة
  this.videoURL = '';
  },
  error: (err) => console.error('❌ Error:', err)
});

    
  }

//
addBookUrl() {
    if(this.booksUrls == undefined || this.booksUrls == '' || this.booksUrls == null){
      return
    }
     var materialsId = this.activatedRoute.snapshot.paramMap.get('dId');
     if(materialsId != null)
    this.usersService.addBookUrl(materialsId,this.booksUrls).pipe(
       this.toast.observe({
              success: ' تم اضافة الفيديو بنجاح  ',
              loading: 'جاري التحميل .....',
              error: ({ message }) => `${message}`,
      })
    ).subscribe({next: (updatedData) => {
    console.log('📚 Updated Material:', updatedData);
    this.materials = updatedData; // أو استخدميها في الواجهة
   this.booksUrls = '';
  },
  error: (err) => console.error('❌ Error:', err)
});    
  }

  //
  addExamUrl() {
    if(this.examUrls == undefined || this.examUrls =='' || this.examUrls==null){
      return
    }
     var materialsId = this.activatedRoute.snapshot.paramMap.get('dId');
     if(materialsId != null)
    this.usersService.addExamUrl(materialsId,this.examUrls).pipe(
       this.toast.observe({
              success: ' تم اضافة الفيديو بنجاح  ',
              loading: 'جاري التحميل .....',
              error: ({ message }) => `${message}`,
      })
    ).subscribe({next: (updatedData) => {
    console.log('📚 Updated Material:', updatedData);
    this.materials = updatedData; // أو استخدميها في الواجهة
  this.examUrls = '';
  },
  error: (err) => console.error('❌ Error:', err)
});    
  }

//
  addGameUrl() {
    if(this.gamesUrls == undefined ||this.gamesUrls==''||this.gamesUrls==null){
      return
    }
     var materialsId = this.activatedRoute.snapshot.paramMap.get('dId');
     if(materialsId != null)
    this.usersService.addGameUrl(materialsId,this.gamesUrls).pipe(
       this.toast.observe({
              success: ' تم اضافة الفيديو بنجاح  ',
              loading: 'جاري التحميل .....',
              error: ({ message }) => `${message}`,
      })
    ).subscribe({next: (updatedData) => {
    console.log('📚 Updated Material:', updatedData);
    this.materials = updatedData; // أو استخدميها في الواجهة
    this.gamesUrls = '';
  },
  error: (err) => console.error('❌ Error:', err)
});    
  }


}
