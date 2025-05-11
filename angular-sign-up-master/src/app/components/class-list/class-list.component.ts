import { Component, OnInit } from '@angular/core';
import { UsreCat } from '../Enums/usre-cat';
import { IClassList } from 'src/app/models/iclass-list';
import { ClassListServiceService } from 'src/app/services/class-list-service.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css']
})
export class ClassListComponent implements OnInit {

   classLst:IClassList[]
  UserTypes = UsreCat;
  constructor(private classService:ClassListServiceService){
  this.classLst = classService.classLst;
  
  }
  openClassDetails(id:number){
  
  }

  ngOnInit(): void {
  }

}
