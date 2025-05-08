import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
import { UserPackage } from 'src/app/models/user-package';
import { PackageService } from 'src/app/services/package.service';
import { UsersService } from 'src/app/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
userCat:any
userCurrentPack:any
packages:UserPackage[] =[];
  constructor(
      private usersService: UsersService,
    private packageService:PackageService) { }

  ngOnInit(): void {
     this.usersService.currentUserProfile$
          .pipe(untilDestroyed(this), tap(console.log))
          .subscribe((user) => {
            this.userCurrentPack = user.packageID;
         this.packages= this.packageService.getPackagesByCat(user.userCategory)
         console.log(this.packages)
          });
  }

}
