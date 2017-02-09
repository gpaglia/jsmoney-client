import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, AppStateService } from '../../_app-services/index';
import {
    AuthenticationService,
    BackendError
} from '../../_backend-services';

import {
    ICredentialsObject,
    IAuthenticateData
} from 'jsmoney-server-api';

@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    @Input() public loading = false;
    @Input() public returnUrl: string;
    @Input() public loginForm: FormGroup;

    // private fields
    private credentials: ICredentialsObject;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private appState: AppStateService
    ) { }

    public ngOnInit() {
        // reset login status
        this.logout();

        this.loading = false;

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.params['returnUrl'] || '/';
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    public logout() {
        this.authenticationService.logout();
        this.appState.clear();
    }

    public login() {
        this.credentials = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password
        };

        this.loading = true;
        if (this.loginForm.valid) {
            this.authenticationService.login(this.credentials)
                .subscribe(
                    (data: IAuthenticateData) => {
                        console.log('Login successful ' + JSON.stringify(data));
                        this.appState.setUser(data.user, data.token);
                        this.router.navigate([this.returnUrl]);
                    },
                    (error: BackendError) => {
                        console.log('Login error ' + error.toString());
                        this.alertService.error(error.toString());
                        this.loading = false;
                    });
        } else {
            console.log('Login form invalid');
        }

    }
}
