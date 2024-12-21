import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', redirectTo: '', pathMatch: 'full'},
    {path: 'signup', component: SignupComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', component: ErrorpageComponent},
];
