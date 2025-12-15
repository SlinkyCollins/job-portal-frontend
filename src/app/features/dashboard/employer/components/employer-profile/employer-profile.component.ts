import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ProfileService } from '../../../../../core/services/profile.service';
import { Auth, GoogleAuthProvider } from '@angular/fire/auth';
import { FacebookAuthProvider, linkWithPopup } from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employer-profile',
  imports: [
    ReactiveFormsModule,
    NgSelectModule, 
    CommonModule
  ],
  templateUrl: './employer-profile.component.html',
  styleUrl: './employer-profile.component.css'
})
export class EmployerProfileComponent {
  profileForm!: FormGroup;
  photoURL: string = '';
  defaultPhotoURL: string = 'https://mockmind-api.uifaces.co/content/abstract/49.jpg';
  user: any = {};
  linkedProviders: string[] = [];
  isSaving: boolean = false;
  isUploading: boolean = false;
  isDeleting: boolean = false;
  isLoading: boolean = true;
  showLinkFacebook: boolean = false;
  showLinkGoogle: boolean = false;
  isGoogleLinked: boolean = false;
  isLinkingGoogle: boolean = false;
  isFacebookLinked: boolean = false;
  isLinkingFacebook: boolean = false;
  completionPercentage: number = 0;
  isAlertDismissed: boolean = false;
  countries = [
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Åland Islands', code: 'AX' },
    { name: 'Albania', code: 'AL' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'American Samoa', code: 'AS' },
    { name: 'AndorrA', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Anguilla', code: 'AI' },
    { name: 'Antarctica', code: 'AQ' },
    { name: 'Antigua and Barbuda', code: 'AG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Aruba', code: 'AW' },
    { name: 'Australia', code: 'AU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Azerbaijan', code: 'AZ' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Bahrain', code: 'BH' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Barbados', code: 'BB' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Belize', code: 'BZ' },
    { name: 'Benin', code: 'BJ' },
    { name: 'Bermuda', code: 'BM' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Bosnia and Herzegovina', code: 'BA' },
    { name: 'Botswana', code: 'BW' },
    { name: 'Bouvet Island', code: 'BV' },
    { name: 'Brazil', code: 'BR' },
    { name: 'British Indian Ocean Territory', code: 'IO' },
    { name: 'Brunei Darussalam', code: 'BN' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Cameroon', code: 'CM' },
    { name: 'Canada', code: 'CA' },
    { name: 'Cape Verde', code: 'CV' },
    { name: 'Cayman Islands', code: 'KY' },
    { name: 'Central African Republic', code: 'CF' },
    { name: 'Chad', code: 'TD' },
    { name: 'Chile', code: 'CL' },
    { name: 'China', code: 'CN' },
    { name: 'Christmas Island', code: 'CX' },
    { name: 'Cocos (Keeling) Islands', code: 'CC' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Comoros', code: 'KM' },
    { name: 'Congo', code: 'CG' },
    { name: 'Congo, The Democratic Republic of the', code: 'CD' },
    { name: 'Cook Islands', code: 'CK' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Cote D\'Ivoire', code: 'CI' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czech Republic', code: 'CZ' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Djibouti', code: 'DJ' },
    { name: 'Dominica', code: 'DM' },
    { name: 'Dominican Republic', code: 'DO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Egypt', code: 'EG' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'Equatorial Guinea', code: 'GQ' },
    { name: 'Eritrea', code: 'ER' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Falkland Islands (Malvinas)', code: 'FK' },
    { name: 'Faroe Islands', code: 'FO' },
    { name: 'Fiji', code: 'FJ' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'French Guiana', code: 'GF' },
    { name: 'French Polynesia', code: 'PF' },
    { name: 'French Southern Territories', code: 'TF' },
    { name: 'Gabon', code: 'GA' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Germany', code: 'DE' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Gibraltar', code: 'GI' },
    { name: 'Greece', code: 'GR' },
    { name: 'Greenland', code: 'GL' },
    { name: 'Grenada', code: 'GD' },
    { name: 'Guadeloupe', code: 'GP' },
    { name: 'Guam', code: 'GU' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Guernsey', code: 'GG' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Guinea-Bissau', code: 'GW' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Haiti', code: 'HT' },
    { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
    { name: 'Holy See (Vatican City State)', code: 'VA' },
    { name: 'Honduras', code: 'HN' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Iceland', code: 'IS' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Iran, Islamic Republic Of', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Isle of Man', code: 'IM' },
    { name: 'Israel', code: 'IL' },
    { name: 'Italy', code: 'IT' },
    { name: 'Jamaica', code: 'JM' },
    { name: 'Japan', code: 'JP' },
    { name: 'Jersey', code: 'JE' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Kiribati', code: 'KI' },
    { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
    { name: 'Korea, Republic of', code: 'KR' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Kyrgyzstan', code: 'KG' },
    { name: 'Lao People\'S Democratic Republic', code: 'LA' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Lesotho', code: 'LS' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libyan Arab Jamahiriya', code: 'LY' },
    { name: 'Liechtenstein', code: 'LI' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Macao', code: 'MO' },
    { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Maldives', code: 'MV' },
    { name: 'Mali', code: 'ML' },
    { name: 'Malta', code: 'MT' },
    { name: 'Marshall Islands', code: 'MH' },
    { name: 'Martinique', code: 'MQ' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Mayotte', code: 'YT' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Micronesia, Federated States of', code: 'FM' },
    { name: 'Moldova, Republic of', code: 'MD' },
    { name: 'Monaco', code: 'MC' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Montserrat', code: 'MS' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Nauru', code: 'NR' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Netherlands Antilles', code: 'AN' },
    { name: 'New Caledonia', code: 'NC' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Nicaragua', code: 'NI' },
    { name: 'Niger', code: 'NE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Niue', code: 'NU' },
    { name: 'Norfolk Island', code: 'NF' },
    { name: 'Northern Mariana Islands', code: 'MP' },
    { name: 'Norway', code: 'NO' },
    { name: 'Oman', code: 'OM' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'Palau', code: 'PW' },
    { name: 'Palestinian Territory, Occupied', code: 'PS' },
    { name: 'Panama', code: 'PA' },
    { name: 'Papua New Guinea', code: 'PG' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Peru', code: 'PE' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Pitcairn', code: 'PN' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Puerto Rico', code: 'PR' },
    { name: 'Qatar', code: 'QA' },
    { name: 'Reunion', code: 'RE' },
    { name: 'Romania', code: 'RO' },
    { name: 'Russian Federation', code: 'RU' },
    { name: 'RWANDA', code: 'RW' },
    { name: 'Saint Helena', code: 'SH' },
    { name: 'Saint Kitts and Nevis', code: 'KN' },
    { name: 'Saint Lucia', code: 'LC' },
    { name: 'Saint Pierre and Miquelon', code: 'PM' },
    { name: 'Saint Vincent and the Grenadines', code: 'VC' },
    { name: 'Samoa', code: 'WS' },
    { name: 'San Marino', code: 'SM' },
    { name: 'Sao Tome and Principe', code: 'ST' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'Senegal', code: 'SN' },
    { name: 'Serbia and Montenegro', code: 'CS' },
    { name: 'Seychelles', code: 'SC' },
    { name: 'Sierra Leone', code: 'SL' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Slovenia', code: 'SI' },
    { name: 'Solomon Islands', code: 'SB' },
    { name: 'Somalia', code: 'SO' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'Sudan', code: 'SD' },
    { name: 'Suriname', code: 'SR' },
    { name: 'Svalbard and Jan Mayen', code: 'SJ' },
    { name: 'Swaziland', code: 'SZ' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Syrian Arab Republic', code: 'SY' },
    { name: 'Taiwan, Province of China', code: 'TW' },
    { name: 'Tajikistan', code: 'TJ' },
    { name: 'Tanzania, United Republic of', code: 'TZ' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Timor-Leste', code: 'TL' },
    { name: 'Togo', code: 'TG' },
    { name: 'Tokelau', code: 'TK' },
    { name: 'Tonga', code: 'TO' },
    { name: 'Trinidad and Tobago', code: 'TT' },
    { name: 'Tunisia', code: 'TN' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Turkmenistan', code: 'TM' },
    { name: 'Turks and Caicos Islands', code: 'TC' },
    { name: 'Tuvalu', code: 'TV' },
    { name: 'Uganda', code: 'UG' },
    { name: 'Ukraine', code: 'UA' },
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'United States', code: 'US' },
    { name: 'United States Minor Outlying Islands', code: 'UM' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Uzbekistan', code: 'UZ' },
    { name: 'Vanuatu', code: 'VU' },
    { name: 'Venezuela', code: 'VE' },
    { name: 'Viet Nam', code: 'VN' },
    { name: 'Virgin Islands, British', code: 'VG' },
    { name: 'Virgin Islands, U.S.', code: 'VI' },
    { name: 'Wallis and Futuna', code: 'WF' },
    { name: 'Western Sahara', code: 'EH' },
    { name: 'Yemen', code: 'YE' },
    { name: 'Zambia', code: 'ZM' },
    { name: 'Zimbabwe', code: 'ZW' }
  ];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private auth: Auth,
    private ngZone: NgZone
  ) {
    // Initialize form early with defaults
    this.profileForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/\s/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/), Validators.maxLength(15)]],
      bio: [''],
      address: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isAlertDismissed = false;
    this.loadProfile();
    this.checkSocialLinked();
    this.profileService.completion$.subscribe(percentage => {
      this.completionPercentage = percentage;
    });
  }

  dismissAlert(): void {
    this.isAlertDismissed = true;
  }

  loadProfile(): void {
    this.isLoading = true;
    this.authService.getSeekerProfile().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.user = response.profile;
          this.photoURL = this.user.profile_pic_url || '';
          this.linkedProviders = JSON.parse(this.user.linked_providers || '[]');
          // Update form with loaded data
          this.profileForm.patchValue({
            fullname: this.user.fullname || '',
            phone: this.user.phone || '',
            bio: this.user.bio || '',
            address: this.user.address || '',
            country: this.user.country || ''
          });
          this.checkSocialLinked();
          this.cdr.detectChanges();  // Force change detection
        }
        this.isLoading = false;
        this.cdr.detectChanges();  // Ensure UI updates
      },
      error: (err) => {
        console.error('loadProfile: Error, err:', err);
        this.isLoading = false;
        this.cdr.detectChanges();  // Ensure UI updates
        this.authService.toastr.error('Failed to load profile. Please refresh.');
      }
    });
  }

  onUploadPhoto(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.dashboardService.uploadProfilePhoto(file).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.photoURL = response.photoURL;  // Update from backend
            const firstname = this.user.fullname?.split(' ')[0] || '';
            // Emit to service
            this.profileService.updateProfile(this.photoURL, firstname);
            this.authService.toastr.success('Profile photo updated successfully');
          }
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.authService.toastr.error('Failed to upload profile photo:', err.message);
          this.isUploading = false;
        }
      });
    }
  }

  onDeletePhoto(): void {
    this.isDeleting = true;
    this.dashboardService.deleteProfilePhoto().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.photoURL = '';  // Revert to default (empty, so fallback to placeholder in template)
          const firstname = this.user.fullname.split(' ')[0];  // Get first part
          // Emit to service
          this.profileService.updateProfile('', firstname);
          this.authService.toastr.success('Profile photo deleted successfully');
        }
        this.isDeleting = false;
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.isDeleting = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.dashboardService.updateProfile(this.profileForm.value).subscribe({
        next: (response: any) => {
          if (response.status) {
            // Update local user data
            this.user.fullname = this.profileForm.value.fullname;
            const firstname = this.user.fullname.split(' ')[0];  // Get first part
            // Emit to service
            this.profileService.updateProfile(this.photoURL, firstname);

            // Merge the form values into the existing user object to get the latest state
            const updatedProfile = { ...this.user, ...this.profileForm.value };

            // Trigger recalculation
            this.profileService.updateCompletionScore(updatedProfile);

            this.authService.toastr.success('Profile updated successfully');

            // Mark form as pristine after successful save
            this.profileForm.markAsPristine();
          }
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Save failed:', err);
          this.authService.toastr.error('Failed to update profile, please try again.');
          this.isSaving = false;
        }
      });
    }
  }

  onReset(): void {
    this.profileForm.patchValue({
      fullname: this.user.fullname || '',
      phone: this.user.phone || '',
      bio: this.user.bio || '',
      address: this.user.address || '',
      country: this.user.country || ''
    });
  }

  getProviderDisplayName(providerId: string): string {
    const icons: { [key: string]: string } = {
      'google.com': '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" height="20" class="me-2">',
      'facebook.com': '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/32px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook" width="20" height="20" class="me-2">'
    };
    return icons[providerId] || providerId;  // Fallback to ID if unknown
  }

  checkSocialLinked(): void {
    this.isFacebookLinked = this.linkedProviders.includes('facebook.com');
    this.isGoogleLinked = this.linkedProviders.includes('google.com');

    // Determine which button to show
    this.showLinkFacebook = this.isGoogleLinked && !this.isFacebookLinked;  // Show if Google linked but Facebook not
    this.showLinkGoogle = this.isFacebookLinked && !this.isGoogleLinked;    // Show if Facebook linked but Google not
  }

  saveLinkedProviders(): void {
    const data = { linked_providers: JSON.stringify(this.linkedProviders) };
    this.dashboardService.updateProfile(data).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.authService.toastr.success('Linked providers updated successfully');
        }
      },
      error: (err) => {
        console.error('Error saving linked providers:', err);
        this.authService.toastr.error('Failed to update linked providers');
      }
    });
  }

  private handleLinkError(error: any): void {
    if (error.code === 'auth/credential-already-in-use') {
      this.authService.toastr.error('This account is already linked to another user.');
    } else if (error.code === 'auth/popup-blocked') {
      this.authService.toastr.error('Popup blocked. Please allow popups and try again.');
    } else {
      this.authService.toastr.error('Failed to link account.');
      console.error('Linking error:', error);
    }
  }

  linkGoogle(): void {
    if (!this.auth.currentUser) {
      this.authService.toastr.error('Please log in first.');
      return;
    }
    this.isLinkingGoogle = true;
    const provider = new GoogleAuthProvider();
    this.ngZone.run(() =>
      linkWithPopup(this.auth.currentUser!, provider)
        .then(async (result) => {
          await this.auth.currentUser?.reload();
          // Update local linkedProviders from Firebase after reload
          this.linkedProviders = this.auth.currentUser?.providerData.map(p => p.providerId) || [];
          this.isLinkingGoogle = false;
          this.authService.toastr.success('Google account linked successfully!');
          this.checkSocialLinked();
          this.saveLinkedProviders();
        }).catch((error) => {
          this.isLinkingGoogle = false;
          this.handleLinkError(error);
        })
    );
  }

  linkFacebook(): void {
    // Detect mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      this.authService.toastr.warning('Facebook linking is not supported on mobile devices. Please use a desktop browser.');
      return;
    }
    if (!this.auth.currentUser) {
      this.authService.toastr.error('Please log in first.');
      return;
    }
    this.isLinkingFacebook = true;
    const provider = new FacebookAuthProvider();
    this.ngZone.run(() =>
      linkWithPopup(this.auth.currentUser!, provider)
        .then(async (result) => {
          await this.auth.currentUser?.reload();  // Refresh user data
          // Update local linkedProviders from Firebase after reload
          this.linkedProviders = this.auth.currentUser?.providerData.map(p => p.providerId) || [];
          console.log('Linked providers after reload:', this.auth.currentUser?.providerData);
          this.isLinkingFacebook = false;
          this.authService.toastr.success('Facebook account linked successfully!');
          this.checkSocialLinked();
          // Save to DB immediately
          this.saveLinkedProviders();
        }).catch((error) => {
          this.isLinkingFacebook = false;
          this.handleLinkError(error);
        })
    );
  }
}
