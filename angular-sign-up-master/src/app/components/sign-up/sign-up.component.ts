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
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PackageService } from 'src/app/services/package.service';
import { UsersService } from 'src/app/services/users.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  TypeId:number = 0
  signUpForm = this.fb.group(
    {
      name: ['', Validators.required],
      userCat: ['', Validators.required],
      NationalId: ['',Validators.required],
      type: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      city: ['', Validators.required],
      collage: ['', Validators.required],
      school: ['', Validators.required],
      specialization: ['', Validators.required],
      gba: ['', Validators.required],
      gradYear: ['', Validators.required],
      jobLevel: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      className: ['', Validators.required],
      stage: ['', Validators.required],
      article: ['', Validators.required],
    },
    { validators: passwordsMatchValidator() }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder,
    private route:ActivatedRoute,
    private packService:PackageService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.TypeId = params['id']; // Access the 'id' parameter from the URL
      console.log('Test ID:', this.TypeId);
      if(this.TypeId ==1){
        this.signUpForm.controls.school.removeValidators([Validators.required]);
        this.signUpForm.controls.className.removeValidators([Validators.required]);
        this.signUpForm.controls.article.removeValidators([Validators.required]);}
        else if(this.TypeId==2){
          this.signUpForm.controls.gradYear.removeValidators([Validators.required]);
          this.signUpForm.controls.jobLevel.removeValidators([Validators.required]);
          this.signUpForm.controls.gba.removeValidators([Validators.required]);
          this.signUpForm.controls.specialization.removeValidators([Validators.required]);  
          this.signUpForm.controls.collage.removeValidators([Validators.required]);  
        }  

    });
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get name() {
    return this.signUpForm.get('name');
  }
  get userCat() {
    return this.signUpForm.get('userCat');
  }
  get NationalId() {
    return this.signUpForm.get('NationalId');
  }
  get city() {
    return this.signUpForm.get('city');
  }
  get collage() {
    return this.signUpForm.get('collage');
  }
  get school() {
    return this.signUpForm.get('school');
  }
  get specialization() {
    return this.signUpForm.get('specialization');
  }
  get gba() {
    return this.signUpForm.get('gba');
  }
  get type() {
    return this.signUpForm.get('type');
  }
  get jobLevel() {
    return this.signUpForm.get('jobLevel');
  }
  get gradYear() {
    return this.signUpForm.get('gradYear');
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
    const {className,article,stage,gradYear,jobLevel,type,gba,specialization,school,collage,city,NationalId,userCat, name, email, password } = this.signUpForm.value;
    if(this.TypeId ==1){
      if (!this.signUpForm.valid ||!userCat|| !name || !password || !email || !NationalId || !city|| !collage  || !specialization || !gba || !type || !jobLevel || !gradYear || !stage) {
        return;
      }
      const pack = this.packService.getFreePackage(userCat);
          const packageID = pack.id;
          var packageStart = new Date().toJSON().slice(0,10).replace(/-/g,'/');;
          
      this.authService
      .signUp(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          
          this.usersService.addUser({ uid, email, displayName: name,userCategory:userCat ,NationalId:NationalId,city:city,collage:collage,specialization:specialization,gba:gba,type:type,jobLevel:jobLevel,gradYear:gradYear,stage:stage,packageID:packageID,packageStart:packageStart})
      ),
        this.toast.observe({
          success: 'مبروك لق قمت بالتسجيل في المنصة',
          loading: 'تسجيل الدخول',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/signSuccess']);
      });
    }else if(this.TypeId==2){
       if (!this.signUpForm.valid ||!userCat|| !name || !password || !email || !NationalId || !city || !school  || !type  || !stage || !article || !className) {
          return;
        }
        
      const pack = this.packService.getFreePackage(userCat);
      const packageID = pack.id;
      var packageStart = new Date().toJSON().slice(0,10).replace(/-/g,'/');;
        this.authService
      .signUp(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.usersService.addUser({ uid, email, displayName: name,userCategory:userCat ,NationalId:NationalId,city:city,school:school,type:type,className:className,stage:stage,article:article})
        ),
        this.toast.observe({
          success: 'مبروك لق قمت بالتسجيل في المنصة',
          loading: 'تسجيل الدخول',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/signSuccess']);
      });
    }

    // if (!this.signUpForm.valid ||!userCat|| !name || !password || !email || !NationalId || !city|| !collage || !school || !specialization || !gba || !type || !jobLevel || !gradYear || !stage || !article || !className) {
    //   return;
    // }

    // this.authService
    //   .signUp(email, password)
    //   .pipe(
    //     switchMap(({ user: { uid } }) =>
    //       this.usersService.addUser({ uid, email, displayName: name,userCategory:userCat ,NationalId:NationalId,city:city,collage:collage,school:school,specialization:specialization,gba:gba,type:type,jobLevel:jobLevel,gradYear:gradYear,className:className,stage:stage,article:article})
    //     ),
    //     this.toast.observe({
    //       success: 'مبروك لق قمت بالتسجيل في المنصة',
    //       loading: 'تسجيل الدخول',
    //       error: ({ message }) => `${message}`,
    //     })
    //   )
    //   .subscribe(() => {
    //     this.router.navigate(['/signSuccess']);
    //   });
  }
}
