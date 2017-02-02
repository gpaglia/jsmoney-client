import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, AuthenticationService } from '../../_services/index';

import { ICredentialsObject } from 'jsmoney-server-api';

@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    private credentials: ICredentialsObject;
    @Input() loading = false;
    @Input() returnUrl: string;
    @Input() loginForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        // reset login status

        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.params['returnUrl'] || '/';
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    login() {
        this.credentials = {username: this.loginForm.value.username, password: this.loginForm.value.password};
        console.log('Login starting, credentials: ' + JSON.stringify(this.credentials, null, 4));
        this.loading = true;
        if (this.loginForm.valid) {
            this.authenticationService.login(this.credentials)
                .subscribe(
                    data => {
                        console.log('Login successful ' + JSON.stringify(data));
                        this.router.navigate([this.returnUrl]);
                    },
                    error => {
                        console.log('Login error ' + error);
                        this.alertService.error(error);
                        this.loading = false;
                    });
        } else {
            console.log('Login form invalid');
        }

    }
}
