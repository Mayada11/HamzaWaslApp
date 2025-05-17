import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLessonService } from 'src/app/services/user-lesson.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dynamin-class',
  templateUrl: './dynamin-class.component.html',
  styleUrls: ['./dynamin-class.component.css']
})
export class DynaminClassComponent implements OnInit {

  constructor(private router:Router,private activatedRoute:ActivatedRoute,private UserLesson:UsersService) { }
returneds:any
docID:any
  ngOnInit(): void {
    //id of الفصل
      var documentID = this.activatedRoute.snapshot.paramMap.get('dId');
      this.docID = documentID
      if(documentID != null)
    this.UserLesson.getTeachersLessonsByLesson(documentID).subscribe(e=>{
  this.returneds=e;
  console.log(e);
    })
  }
gotolessons(uid:string,teacherID:string){
  localStorage.setItem('userCreatedId',teacherID); 
  this.router.navigate(['/classDetails', uid]);
console.log(uid)
}
}
