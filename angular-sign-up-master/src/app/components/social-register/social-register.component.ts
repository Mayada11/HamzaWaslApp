import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PackageService } from 'src/app/services/package.service';
import { UsersService } from 'src/app/services/users.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-social-register',
  templateUrl: './social-register.component.html',
  styleUrls: ['./social-register.component.css']
})
export class SocialRegisterComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  uid: string = ''
  socialID: string = ''
  signUpForm = this.fb.group(
    {
      name: ['', Validators.required],
      className: ['', Validators.required],
      stage: ['', Validators.required],
      article: ['', Validators.required],
    },
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private packService: PackageService,
  ) { }
  ngOnInit(): void {
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get stage() {
    return this.signUpForm.get('stage');
  }
  get article() {
    return this.signUpForm.get('article');
  }
  get className() {
    return this.signUpForm.get('className');
  }

  submit() {
    const { className, article, stage, name } = this.signUpForm.value;
    if (!this.signUpForm.valid || !name || !stage || !article || !className) {
      return;
    }
    this.usersService.currentUserProfile$
      .subscribe((user) => {
        this.uid = user?.uid as string
        this.usersService.addSociety({ socialID: this.socialID, creator: user?.displayName, socialName: name, socialclass: className, socialStage: stage, socialSubject: article, uid: this.uid }).pipe(
        ).subscribe((ele) => {
          this.usersService.updateSociety({ socialID: ele['id'] }).pipe(
            this.toast.observe({
              success: 'تم انشاء المجتمع بنجاح',
              loading: 'جاري الانشاء .....',
              error: ({ message }) => `${message}`,
            })
          ).subscribe(() => {
            localStorage.setItem("societyID",ele['id']);
            this.router.navigate(['/socialMedia']);
          });

        });

      })
  }



}
