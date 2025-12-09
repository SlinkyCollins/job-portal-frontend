import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { jobSeekerGuardGuard } from './core/guards/job-seeker-guard.guard';
import { employerGuardGuard } from './core/guards/employer-guard.guard';
import { EmployerDashboardComponent } from './features/dashboard/employer-dashboard/employer-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './features/home/home.component';
import { RoleSelectComponent } from './auth/role-select/role-select.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SeekerDashboardComponent } from './features/dashboard/seeker/seeker-dashboard.component';
import { JobWishlistComponent } from './features/dashboard/seeker/components/job-wishlist/job-wishlist.component';
import { ProfileComponent } from './features/dashboard/seeker/components/profile/profile.component';
import { ResumeComponent } from './features/dashboard/seeker/components/resume/resume.component';
import { SavedJobsComponent } from './features/dashboard/seeker/components/saved-jobs/saved-jobs.component';
import { AccountsettingsComponent } from './features/dashboard/shared/components/accountsettings/accountsettings.component';
import { DashboardHomeComponent } from './features/dashboard/seeker/components/dashboard-home/dashboard-home.component';
import { PrivacypolicyComponent } from './features/general/privacypolicy/privacypolicy.component';
import { TermsComponent } from './features/general/terms/terms.component';
import { CookiepolicyComponent } from './features/general/cookiepolicy/cookiepolicy.component';
import { JobsListComponent } from './features/jobs/jobs-list/jobs-list.component';
import { JobDetailsComponent } from './features/jobs/job-details/job-details.component';
import { ContactComponent } from './features/general/contact/contact.component';
import { ErrorpageComponent } from './features/general/errorpage/errorpage.component';



export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'JobNet' },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent, title: 'Register | JobNet' },
    { path: 'login', component: LoginComponent, title: 'Login | JobNet' },
    { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot Password | JobNet' },
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
            // { path: 'job-alert', component: JobalertsComponent, title: 'Job Alerts | JobNet' }, DEFERRED AFTER MVP
            { path: 'saved-jobs', component: SavedJobsComponent, title: 'Saved Jobs | JobNet' },
            { path: 'account-settings', component: AccountsettingsComponent, title: 'Account Settings | JobNet' }
        ],
        canActivate: [jobSeekerGuardGuard]
    },
    { path: 'dashboard/employer', component: EmployerDashboardComponent, title: 'Employer Dashboard | JobNet', canActivate: [employerGuardGuard] },
    { path: 'admin/dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard | JobNet' },
    { path: '**', component: ErrorpageComponent, title: '404 Not Found | JobNet' },
];
