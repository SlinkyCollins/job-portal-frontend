import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { jobSeekerGuardGuard } from './core/guards/job-seeker-guard.guard';
import { employerGuardGuard } from './core/guards/employer-guard.guard';
import { HomeComponent } from './features/home/home.component';
import { RoleSelectComponent } from './auth/role-select/role-select.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SeekerDashboardComponent } from './features/dashboard/seeker/seeker-dashboard.component';
import { ProfileComponent } from './features/dashboard/seeker/components/profile/profile.component';
import { ResumeComponent } from './features/dashboard/seeker/components/resume/resume.component';
import { SavedJobsComponent } from './features/dashboard/seeker/components/saved-jobs/saved-jobs.component';
import { AppliedJobsComponent } from './features/dashboard/seeker/components/applied-jobs/applied-jobs.component';
import { AccountsettingsComponent } from './features/dashboard/shared/components/accountsettings/accountsettings.component';
import { DashboardHomeComponent } from './features/dashboard/seeker/components/dashboard-home/dashboard-home.component';
import { PrivacypolicyComponent } from './features/general/privacypolicy/privacypolicy.component';
import { TermsComponent } from './features/general/terms/terms.component';
import { CookiepolicyComponent } from './features/general/cookiepolicy/cookiepolicy.component';
import { JobsListComponent } from './features/jobs/jobs-list/jobs-list.component';
import { JobDetailsComponent } from './features/jobs/job-details/job-details.component';
import { ContactComponent } from './features/general/contact/contact.component';
import { ErrorpageComponent } from './features/general/errorpage/errorpage.component';
import { EmployerDashboardComponent } from './features/dashboard/employer/employer-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin/admin-dashboard.component';
import { EmployerHomeComponent } from './features/dashboard/employer/components/employer-home/employer-home.component';
import { CompanyProfileComponent } from './features/dashboard/employer/components/company-profile/company-profile.component';
import { PostJobComponent } from './features/dashboard/employer/components/post-job/post-job.component';
import { MyJobsComponent } from './features/dashboard/employer/components/my-jobs/my-jobs.component';
import { EmployerProfileComponent } from './features/dashboard/employer/components/employer-profile/employer-profile.component';
import { ApplicationsComponent } from './features/dashboard/employer/components/applications/applications.component';

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
    { path: 'role-select', component: RoleSelectComponent, title: 'Role Select | JobNet' },
    {
        path: 'dashboard/jobseeker',
        component: SeekerDashboardComponent,
        title: 'Job Seeker Dashboard | JobNet',
        children: [
            { path: '', component: DashboardHomeComponent, title: 'Dashboard Home | JobNet' },
            { path: 'profile', component: ProfileComponent, title: 'Profile | JobNet' },
            { path: 'resume', component: ResumeComponent, title: 'Resume | JobNet' },
            { path: 'applied-jobs', component: AppliedJobsComponent, title: 'Applied Jobs | JobNet' },
            { path: 'saved-jobs', component: SavedJobsComponent, title: 'Saved Jobs | JobNet' },
            { path: 'account-settings', component: AccountsettingsComponent, title: 'Account Settings | JobNet' }
        ],
        canActivate: [jobSeekerGuardGuard]
    },
    {
        path: 'dashboard/employer',
        component: EmployerDashboardComponent,
        title: 'Employer Dashboard | JobNet',
        children: [
            { path: '', component: EmployerHomeComponent, title: 'Dashboard Home | JobNet'  },
            { path: 'profile', component: EmployerProfileComponent, title: 'Profile | JobNet' },
            { path: 'company-profile', component: CompanyProfileComponent, title: 'Company Profile | JobNet'  },
            { path: 'applications', component: ApplicationsComponent, title: 'Applications | JobNet'  },
            { path: 'post-job', component: PostJobComponent, title: 'Submit Job | JobNet'  },
            { path: 'edit-job/:id', component: PostJobComponent, title: 'Edit Job | JobNet'  },
            { path: 'my-jobs', component: MyJobsComponent, title: 'My Jobs | JobNet'  },
            { path: 'account-settings', component: AccountsettingsComponent, title: 'Account Settings | JobNet'  },
        ],
        canActivate: [employerGuardGuard]
    },
    { path: 'admin/dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard | JobNet' },
    { path: '**', component: ErrorpageComponent, title: '404 Not Found | JobNet' },
];
