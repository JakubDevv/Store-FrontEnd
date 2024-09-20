import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../domains/auth/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private service: AuthService) { }

  ngOnInit(): void {
    document.cookie = "";
    this.form = this.formBuilder.group({
      userName: '',
      firstName: '',
      lastName: '',
      password:''
    })
  }

  submit(){
    this.service.register(this.form).subscribe((data: any)=>{
      document.cookie = data.refreshToken;
      this.router.navigate(['/']).then(() => window.location.reload());
     });
  }

}
