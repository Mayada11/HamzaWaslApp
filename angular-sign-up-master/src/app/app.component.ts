import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { filter } from 'rxjs';
import { UserCat } from './components/Enums/usre-cat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-sign-up-master';
  user$ = this.usersService.currentUserProfile$;
  userCat:any;
  constructor(
    private authService: AuthService,
    public usersService: UsersService,
    private router: Router
  )
  {

//    this.usersService.getAllUsers(UserCat.طالب, 'Vv5FuIPrK71LNQNk3pgW').subscribe((res)=>console.log(res));
//    this.user$.subscribe((res)=>{if(res!==null && res!==undefined) console.log(res)});
// this.usersService.getTeacherBySocietyId('0jyjgxdxU6vhVtKg088I').subscribe((res)=>console.log(res??"null"));
// this.usersService.getUser('VxI7IpXXqYUUtXT4Y6bWPYD2sml1').subscribe((res)=>console.log(res??"null"));
//   this.usersService.getAllUsers(UserCat.طالب, 'Vv5FuIPrK71LNQNk3pgW' , true).subscribe((res)=>{
//     console.log(res)
//   })
// this.usersService.addSociety({uid : "VxI7IpXXqYUUtXT4Y6bWPYD2sml1" ,  socialName: "نادى الاحياء  | تعلم بفكرمحتلف", socialclass: "التالت", socialStage: "الثانويه", socialSubject: "الاحياء"})
// .subscribe(res=>console.log(res));

// this.usersService.getSocietiesByUserId('hNmI5SKUcMNMImp3iwBknAF4Vjf1').subscribe({
//   next: res => console.log(res),
//   error: err => console.log('error getting socities',err)
// })

// this.usersService.getSocietyById('1746841504283').subscribe({
//   next: res => console.log(res),
//   error: err => console.log('error getting socities',err)
// })

  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
