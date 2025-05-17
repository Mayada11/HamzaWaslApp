import { Component, OnInit } from '@angular/core';
import { UsreCat } from '../Enums/usre-cat';
import { IClassList } from 'src/app/models/iclass-list';
import { ClassListServiceService } from 'src/app/services/class-list-service.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css']
})
export class ClassListComponent implements OnInit {

   classLst:any
  UserTypes = UsreCat;
  constructor(private classlistService:UsersService){
   this.classlistService.getlessonData().subscribe(ele=>{
    this.classLst = ele;
   })
  
  }
  openClassDetails(id:number){
  
  }

  ngOnInit(): void {
  }

}
