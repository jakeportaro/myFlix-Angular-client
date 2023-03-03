import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit{

  user: any={};

  @Input() updatedUser = { Username: '', Password: '', Email: '', Birthday: '' };//Decorator

  constructor(
    public fetchApiDataService: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
    ) {}

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Make API call to get user info, change the format of 'Birthday' property of localDateString
   * and set the uer variable to the user object
   * @returns object with user information
   */
  getUser(): void {
    this.fetchApiDataService.getUser().subscribe((resp: any)=>{
      this.user = resp;
      console.log(this.user);
      return this.user;
    });
  }

  /**
   * Log out the user
   * 
   * @remarks
   * Make API call to delete the user, navigate of welcome-page and remove user info from localStorage
   */
  onDeleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannnot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.snackBar.open('You have successfully deleted your account!', 'OK', {
          duration: 3000
        });
      });
    }

    this.fetchApiDataService.deleteUser().subscribe(res=>{
      console.log('deleteAccountRes:', res);
    })
  }

  /**
   * Update user info
   * 
   * @remarks
   * Make API call to update the user, reset the localstorage and reload the profile-page
   */
  onUserUpdate(): void {
    console.log('before');
    this.fetchApiDataService.updateUser(this.updatedUser).subscribe((response) => {

      console.log('after');
      // Logic for a successful user registration goes here! (To be implemented)
      localStorage.setItem('user', response.Username);
      this.snackBar.open('Your profile is updated successfully!', 'OK', {
        duration: 4000
      });
      window.location.reload();
    }, (response) => {
      //Error response
      //console.log('onUserUpdate() response2:', response);
      this.snackBar.open(response.errors[0].msg, 'OK', {
        duration: 6000
      });
    });
  }
  
}