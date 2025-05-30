import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
 user$ = this.usersService.currentUserProfile$;
  userCat:any;
   constructor(
      private authService: AuthService,
      public usersService: UsersService,
      private router: Router
    ) {}
  
    logout() {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  ngOnInit(): void {}
}
