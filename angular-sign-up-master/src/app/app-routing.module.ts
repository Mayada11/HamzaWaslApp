import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';
import { SignOptionComponent } from './components/sign-option/sign-option.component';
import { SignSuccessComponent } from './components/sign-success/sign-success.component';
import { PackagesComponent } from './components/packages/packages.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
     ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'signOption',
    component: SignOptionComponent,
     ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'sign-up/:id',
    component: SignUpComponent,
     ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'signSuccess',
    component: SignSuccessComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'profile',
    component: ProfileComponent,
     ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'package',
    component: PackagesComponent,
     ...canActivate(redirectUnauthorizedToLogin),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
