import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { SeekerDashboardComponent } from './dashboard/seeker-dashboard/seeker-dashboard.component';
import { EmployerDashboardComponent } from './dashboard/employer-dashboard/employer-dashboard.component';
import { guardsGuard } from './core/guards/guards.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', redirectTo: '', pathMatch: 'full'},
    {path: 'signup', component: SignupComponent},
    {path: 'login', component: LoginComponent},
    {path: 'jobseeker/dashboard', component: SeekerDashboardComponent, canActivate: [guardsGuard]},
    {path: 'employer/dashboard', component: EmployerDashboardComponent},
    {path: 'admin/dashboard', component: AdminDashboardComponent},
    {path: '**', component: ErrorpageComponent},
];
