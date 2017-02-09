import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../_app-services/index';
import { UserService } from '../../_backend-services/index';

@Component({
    templateUrl: './register.component.html'
})

export class RegisterComponent {
    @Input() public model: any = {};
    @Input() public loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    public register() {
      /*
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
      */
    }
}
