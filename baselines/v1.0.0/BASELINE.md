JobNet v1.0.0 Baseline
----------------------

Frontend:
Angular 18
Commit: ddc7d26

Backend:
Vanilla PHP 8.2
Commit: 7b78010
Repository: https://github.com/SlinkyCollins/job-portal-backend

Database:
MySQL 8.0
Schema snapshot folder: db/
Schema files: db/jobnet_db_*.sql (structure only)

<details>
<summary>Schema Capture Note (Hidden by Default)</summary>

I generated and recorded the schema using MySQL Workbench (export/mysqldump) as a structure-only SQL dump (no data).

</details>

Dependencies:
Frontend: ../../package.json
Backend: ../../backend/composer.json

<details>
<summary>Dependency Manifests (Hidden by Default)</summary>

Frontend (package.json):

```json
{
	"name": "job-portal",
	"version": "0.0.0",
	"scripts": {
		"ng": "ng",
		"start": "ng serve",
		"build": "ng build",
		"watch": "ng build --watch --configuration development",
		"test": "ng test"
	},
	"private": true,
	"dependencies": {
		"@angular-slider/ngx-slider": "^19.0.0",
		"@angular/animations": "^19.2.7",
		"@angular/common": "^19.2.7",
		"@angular/compiler": "^19.2.7",
		"@angular/core": "^19.2.7",
		"@angular/fire": "^19.2.0",
		"@angular/forms": "^19.2.7",
		"@angular/platform-browser": "^19.2.7",
		"@angular/platform-browser-dynamic": "^19.2.7",
		"@angular/router": "^19.2.7",
		"@fortawesome/angular-fontawesome": "^1.0.0",
		"@fortawesome/fontawesome-free": "^6.7.2",
		"@fortawesome/fontawesome-svg-core": "^6.7.2",
		"@fortawesome/free-regular-svg-icons": "^6.7.2",
		"@fortawesome/free-solid-svg-icons": "^6.7.2",
		"@ng-select/ng-select": "^14.1.0",
		"bootstrap": "^5.3.3",
		"bootstrap-icons": "^1.13.1",
		"chart.js": "^4.5.0",
		"date-fns": "^4.1.0",
		"firebase": "^11.10.0",
		"mammoth": "^1.11.0",
		"ngx-extended-pdf-viewer": "^25.6.4",
		"ngx-toastr": "^19.0.0",
		"rxjs": "~7.8.0",
		"swiper": "^11.2.10",
		"tslib": "^2.3.0",
		"zone.js": "~0.15.0"
	},
	"devDependencies": {
		"@angular-devkit/architect": "^0.1902.8",
		"@angular-devkit/build-angular": "^19.2.8",
		"@angular/cli": "^19.2.8",
		"@angular/compiler-cli": "^19.2.7",
		"@types/jasmine": "~5.1.0",
		"jasmine-core": "~5.2.0",
		"karma": "~6.4.0",
		"karma-chrome-launcher": "~3.2.0",
		"karma-coverage": "~2.2.0",
		"karma-jasmine": "~5.1.0",
		"karma-jasmine-html-reporter": "~2.1.0",
		"typescript": "~5.5.2"
	}
}
```

Backend (composer.json):

```json
{
	"name": "collynx/jobnet-backend",
	"description": "JobNet PHP backend for Firebase auth",
	"license": "MIT",
	"authors": [
		{
			"name": "Ademola Afolabi",
			"email": "afolabiademola27@gmail.com"
		}
	],
	"require": {
		"kreait/firebase-php": "^5.26",
		"vlucas/phpdotenv": "^5.6",
		"firebase/php-jwt": "^6.11",
		"cloudinary/cloudinary_php": "^3.1"
	}
}
```

</details>

API:
API endpoint inventory — v1.0.0

<details>
<summary>API Endpoint Index (Hidden by Default)</summary>

Index of /JobPortal/api/auth:
- create_admin_cli.php
- login.php
- logout.php
- save_role.php
- signup.php
- social_login.php

Index of /JobPortal/api/dashboard/admin:
- add_category.php
- admin_dashboard.php
- delete_category.php
- delete_job.php
- delete_user.php
- get_categories.php
- get_jobs.php
- get_stats.php
- get_users.php
- suspend_user.php
- update_category.php
- update_job_status.php
- update_password.php

Index of /JobPortal/api/dashboard/employer:
- close_job.php
- delete_job.php
- employer_dashboard.php
- get_applications.php
- get_company_profile.php
- get_dashboard_data.php
- get_employer_jobs.php
- get_job_details.php
- get_profile.php
- get_tags.php
- post_job.php
- save_company_profile.php
- update_application_status.php
- update_job.php
- update_profile.php

Index of /JobPortal/api/dashboard/seeker:
- all_applications.php
- delete_cv.php
- recent_applications.php
- retract_application.php
- saved_jobs.php
- seeker_dashboard.php
- seeker_profile.php
- seeker_stats.php
- update_profile.php
- update_resume.php
- upload_cv.php

Index of /JobPortal/api/dashboard/shared:
- change_password.php
- delete_account.php
- delete_profile_photo.php
- get_settings.php
- link_social.php
- update_account.php
- upload_profile_photo.php
- user_data.php
- verify_old_password.php

Index of /JobPortal/api/jobs:
- all_jobs.php
- apply.php
- categories.php
- jobdetails.php
- recent_jobs.php
- wishlist.php
- wishlist_delete.php

</details>

Verified workflows:
- Authentication
- Job posting
- Job application
- Saved jobs
- Dashboards
- Admin workflows
- Firebase auth/linking
- Cloudinary uploads

During the baseline verification, I discovered that account settings could remain stuck in a loading state because of incorrect user initialization/response handling. I fixed the issue before freezing the v1.0.0 baseline.