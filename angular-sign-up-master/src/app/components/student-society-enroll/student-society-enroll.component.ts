import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ISocial } from 'src/app/models/isocial';
import { ProfileUser } from 'src/app/models/user';

import { UserCat, UserRole, UserRoles } from '../Enums/usre-cat';
import { user } from 'rxfire/auth';
import { HotToastService } from '@ngneat/hot-toast';
import { SocialService } from 'src/app/services/social.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-society-enroll',
  templateUrl: './student-society-enroll.component.html',
  styleUrls: ['./student-society-enroll.component.css']
})
export class StudentSocietyEnrollComponent implements OnInit {

toast = inject(HotToastService)
form!: FormGroup<{ socialId: FormControl<string|null>; userId: FormControl<string|null>; selectedRole:FormControl<null|string> }>;
  societies: ISocial[] = [];
  users: ProfileUser[]|undefined = [];
 // loadingUsers = false;

  selectedRole : UserRoles | '' ='';
  roles : Set<UserRoles> =  new Set<UserRoles>(Object.values(UserRoles))

 userRole = (num:UserRoles):UserRole =>UserRole[num]
  constructor(private fb: FormBuilder, private usersService: SocialService,private router:Router ) {}

//   onRoleChange() {
//   if (this.selectedRole) {
//     this.usersService.getAllUsers(this.selectedRole, this.).subscribe(users => {
//       this.users = users;
//     });
//   } else {
//     this.users = [];
//   }
// }

  ngOnInit(): void {
    this.form = this.fb.group({
      socialId: [''],
      userId: [''],
      selectedRole : ['']
    });

    // Load teacher's societies
    this.usersService.currentUserProfile$.subscribe(user => {
      if (user?.uid) {
        this.usersService.getSocietiesByTeacherId(user.uid).subscribe(socs => {
          this.societies = socs;
        });
      }

      this.form.get('selectedRole')?.valueChanges.subscribe(selectedRole=>{
        console.log(selectedRole);
  //this.users= [];
  if (selectedRole && this.form.get('socialId')?.value) {
  //  this.loadingUsers = true;
  this.users =undefined;
    this.usersService.getAllUsers(<UserCat>selectedRole, this.form.get('socialId')?.value!).subscribe(filtered => {
      this.users = filtered;
    //  this.loadingUsers = false;
    });
  }})
    this.form.get('socialId')?.valueChanges.subscribe(socialId => {
  this.users= [];
  if (socialId && this.form.get('selectedRole')?.value) {
   // this.loadingUsers = true;
this.users = undefined;
    this.usersService.getAllUsers(<UserCat>this.form.get('selectedRole')?.value,socialId).subscribe(filtered => {
      this.users = filtered;
     // this.loadingUsers = false;
    });
  }
});
    });


  }


  onSubmit() {
    const { socialId, userId,selectedRole } = this.form.value;
    if (socialId && userId&& selectedRole) {
       this.usersService.AddUserToSociety(userId, socialId).subscribe({
         next: (data) => {
           this.toast.success('Student added to society!');
          this.router.navigate(['/socialMedia',socialId]);

           this.form.reset({
             socialId: '',
             userId: '',
             selectedRole: ''
           });
           this.users = [];
         },
         error: (err) => {
           this.toast.error('failed to add member ',err.message);
         }

       })
    // .subscribe(
    //     {next:(data) => {
    //     //alert('Student added to society!');
    //     this.toast.success('Student added to society!');
    //     // reload filtered students list
    //     this.form.reset({
    //     socialId: '',
    //     userId: '',
    //     selectedRole: ''
    //   });
    //   this.users = [];
    //     // this.usersService.getAllStudents(socialID).subscribe(filtered => {
    //     //   this.students = filtered;
    //     // });
     
    //   }
    //    ,
    // err: (err) => {
    //       this.toast.error('failed to add member ',err.message);
    //     }});
    }
    else{
      console.log('missing form data');
    }
  }


}
