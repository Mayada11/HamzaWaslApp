import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { ISocial } from 'src/app/models/isocial';

import { UserCat } from '../Enums/usre-cat';
import { ProfileUser } from 'src/app/models/user';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-social-media-list',
  templateUrl: './social-media-list.component.html',
  styleUrls: ['./social-media-list.component.css']
})
export class SocialMediaListComponent implements OnInit {

  societies : Array<ISocial>|undefined
  user :ProfileUser|null = null;
 isTeacher(userCategory:UserCat):boolean{
  return userCategory === UserCat.معلم
 }

  constructor(private readonly router: Router , private readonly userService:SocialService) {}

  ngOnInit(): void {
    const user = this.userService.currentUserProfile$
    //.pipe(filter((v)=>v!==null))
    .subscribe((user)=>{
     
      if(user!==null && user!==undefined){
        this.user = user;
        if(user.userCategory === UserCat.معلم){
       this.userService.getSocietiesByTeacherId(user.uid).subscribe((sc)=>{
        console.log(sc);
        this.societies = sc});
        }
        else{
          console.log('iam in else')
          this.userService.getSocietiesByUserId(user.uid).subscribe((sc)=>{
            console.log(sc);
            this.societies = sc});
        }

      }
    });
  }

}
