import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
constructor(private classLst:ClassListServiceService,private activatedRoute:ActivatedRoute){
}
ngOnInit(): void {
  this.recievedClassId = Number(this.activatedRoute.snapshot.paramMap.get('dId'));
  this.classList = this.classLst.getElementById(this.recievedClassId);
}

}
