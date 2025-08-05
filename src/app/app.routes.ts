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
import { DashboardHomeComponent } from './components/sections/dashboard-home/dashboard-home.component';
import { ProfileComponent } from './components/sections/profile/profile.component';
import { ResumeComponent } from './components/sections/resume/resume.component';
import { JobalertsComponent } from './components/sections/jobalerts/jobalerts.component';
import { SavedJobsComponent } from './components/sections/saved-jobs/saved-jobs.component';
import { AccountsettingsComponent } from './components/sections/accountsettings/accountsettings.component';
import { DeleteaccountComponent } from './components/sections/deleteaccount/deleteaccount.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { ContactComponent } from './contact/contact.component';
import { JobDetailsComponent } from './job-details/job-details.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'jobs', component: JobsListComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'jobdetails', component: JobDetailsComponent },
    {
        path: 'dashboard/jobseeker',
        component: SeekerDashboardComponent,
        children: [
            { path: '', component: DashboardHomeComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'resume', component: ResumeComponent },
            { path: 'job-alert', component: JobalertsComponent },
            { path: 'saved-jobs', component: SavedJobsComponent },
            { path: 'account-settings', component: AccountsettingsComponent },
            { path: 'delete-account', component: DeleteaccountComponent },
        ],
        canActivate: [jobSeekerGuardGuard]
    },
    { path: 'dashboard/employer', component: EmployerDashboardComponent, canActivate: [employerGuardGuard] },
    { path: 'admin/dashboard', component: AdminDashboardComponent },
    { path: '**', component: ErrorpageComponent },
];
