import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../domains/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  alert: string[] = ["alert", "hide"];

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private service: AuthService) { }

  ngOnInit(): void {
    document.cookie = "";
    this.form = this.formBuilder.group({
      username: '',
      password:''
    });
  }

  submit(){
    this.service.login(this.form).subscribe((data: any)=>{
      this.router.navigate(['/']).then(() => window.location.reload());
      document.cookie = `${data.refreshToken}; path=/`;
     },
        e => this.showWarning()
    );
  }

  closeWarning() {
    this.alert =["alert", "hide", "hideAlert"];
  }

  showWarning() {
    this.alert =["alert", "show", "showAlert"];
    setTimeout(() => {
      this.closeWarning();
    }, 5000);
  }

}
