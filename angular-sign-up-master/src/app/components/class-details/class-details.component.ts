import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IClassList } from 'src/app/models/iclass-list';
import { ClassListServiceService } from 'src/app/services/class-list-service.service';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent implements OnInit {
  classList:IClassList | null = null;
  recievedClassId:number = 0;
constructor(private classLst:ClassListServiceService,private activatedRoute:ActivatedRoute,private router:Router){
}
ngOnInit(): void {
  this.recievedClassId = Number(this.activatedRoute.snapshot.paramMap.get('dId'));
  this.classList = this.classLst.getElementById(this.recievedClassId);
}
showVideo(videoUrl?:string){
  if(videoUrl!=null){
    localStorage.setItem("videoURL",videoUrl);
    this.router.navigate(['/classVideo']);
  }
  
}
}
