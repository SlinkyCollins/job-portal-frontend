import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { jobSeekerGuardGuard } from './core/guards/job-seeker-guard.guard';
import { employerGuardGuard } from './core/guards/employer-guard.guard';
import { SeekerDashboardComponent } from './features/dashboard/seeker-dashboard/seeker-dashboard.component';
import { EmployerDashboardComponent } from './features/dashboard/employer-dashboard/employer-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';



export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', redirectTo: '', pathMatch: 'full'},
    {path: 'signup', component: SignupComponent},
    {path: 'login', component: LoginComponent},
    {path: 'jobseeker/dashboard', component: SeekerDashboardComponent, canActivate: [jobSeekerGuardGuard]},
    {path: 'employer/dashboard', component: EmployerDashboardComponent, canActivate: [employerGuardGuard]},
    {path: 'admin/dashboard', component: AdminDashboardComponent},
    {path: '**', component: ErrorpageComponent},
];
