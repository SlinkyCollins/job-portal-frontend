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
import { JobWishlistComponent } from './job-wishlist/job-wishlist.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsComponent } from './terms/terms.component';
import { CookiepolicyComponent } from './cookiepolicy/cookiepolicy.component';
import { RoleSelectComponent } from './role-select/role-select.component';



export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'JobNet' },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent, title: 'Register | JobNet' },
    { path: 'login', component: LoginComponent, title: 'Login | JobNet' },
    { path: 'privacy-policy', component: PrivacypolicyComponent, title: 'Privacy Policy | JobNet' },
    { path: 'terms-of-service', component: TermsComponent, title: 'Terms of Service | JobNet' },
    { path: 'cookie-policy', component: CookiepolicyComponent, title: 'Cookie Policy | JobNet' },
    { path: 'jobs', component: JobsListComponent, title: 'Jobs | JobNet' },
    { path: 'jobdetails/:id', component: JobDetailsComponent, title: 'Job Details | JobNet' },
    { path: 'contact', component: ContactComponent, title: 'Contact | JobNet' },
    { path: 'jobwishlist', component: JobWishlistComponent, title: 'Job Wishlist | JobNet' },
    { path: 'role-select', component: RoleSelectComponent, title: 'Role Select | JobNet' },
    {
        path: 'dashboard/jobseeker',
        component: SeekerDashboardComponent,
        title: 'Job Seeker Dashboard | JobNet',
        children: [
            { path: '', component: DashboardHomeComponent, title: 'Dashboard Home | JobNet' },
            { path: 'profile', component: ProfileComponent, title: 'Profile | JobNet' },
            { path: 'resume', component: ResumeComponent, title: 'Resume | JobNet' },
            { path: 'job-alert', component: JobalertsComponent, title: 'Job Alerts | JobNet' },
            { path: 'saved-jobs', component: SavedJobsComponent, title: 'Saved Jobs | JobNet' },
            { path: 'account-settings', component: AccountsettingsComponent, title: 'Account Settings | JobNet' },
            { path: 'delete-account', component: DeleteaccountComponent, title: 'Delete Account | JobNet' },
        ],
        canActivate: [jobSeekerGuardGuard]
    },
    { path: 'dashboard/employer', component: EmployerDashboardComponent, title: 'Employer Dashboard | JobNet', canActivate: [employerGuardGuard] },
    { path: 'admin/dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard | JobNet' },
    { path: '**', component: ErrorpageComponent, title: '404 Not Found | JobNet' },
];
