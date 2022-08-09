import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from 'src/app/component/model/employee.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string;
  loginForm!: FormGroup;
  username: string;
  password: string;
  employee!: Employee;

  constructor(private authService: AuthService, private router: Router) {
    this.message='';
    this.username='';
    this.password='';
   }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });

    this.authService.message$.subscribe(data=>{
      this.message = data;
    })
  }
  onFormSubmit(){
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;

    this.authService.login(this.username,this.password).subscribe({
      next : (data)=>{
          this.employee = data;
          localStorage.setItem('username',this.employee.username);
          localStorage.setItem('credentials', btoa(this.username + ':' + this.password));
          this.authService.username$.next(this.employee.username);
          this.router.navigateByUrl('/');
      },
      error: (e)=> {
        this.authService.message$.next("Invalid Credentials");
      }
    });
  }
  toLogin(): void{
    this.router.navigateByUrl("/login");
  }
  toSignUp(): void{
    this.router.navigateByUrl("/sign-up");
  }
  toVerifyUsername():void{
    this.router.navigateByUrl('/verify-username');
  }
}
