import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  onLogin() {
    
    this.navCtrl.navigateRoot('/tabs', {animated: false});
    
  }
  
  goToSignUp() {
    this.navCtrl.navigateForward('/signup');
  }

}
