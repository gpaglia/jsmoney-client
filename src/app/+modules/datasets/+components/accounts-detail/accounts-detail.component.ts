
import {
    Component,
    OnInit,
    OnDestroy,
    Input
} from '@angular/core';

import {
    Router,
    ActivatedRoute,
    Params
} from '@angular/router';

import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Observable } from 'rxjs/observable';
import { Subscription } from 'rxjs';

import {
    AccountService,
    CurrencyService
} from '../../../../_backend-services';

import {
    AlertService,
    AppStateService
} from '../../../../_app-services';

import {
    IDatasetObject,
    IAccountObject,
    AccountType,
    ICurrencyObject
} from 'jsmoney-server-api';

console.log('`Accounts new` component loaded asynchronously');

type CurrencyList = Array<{
    id: string,
    text: string
}>;

@Component({
    selector: 'accounts-detail',
    templateUrl: './accounts-detail.component.html',
})
export class AccountsDetailComponent implements OnInit, OnDestroy {

    @Input() public dataset: IDatasetObject;
    @Input() public account: IAccountObject;
    @Input() public accountForm: FormGroup;
    @Input() public mode: 'new' | 'edit' | 'view';
    @Input() public id: string;
    @Input() public allcurrencies: boolean = false;
    @Input() public clist: CurrencyList;
    @Input() public acctypes: string[];
    private paramSub: Subscription;
    private dataSub: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertService,
        private currencyService: CurrencyService,
        private appStateService: AppStateService
    ) { }

    public ngOnInit() {
        console.log('hello `Accounts New` component');

        // build array of account type names
        this.acctypes = [];
        for (let n in AccountType) {
            if (typeof AccountType[n] === 'number') {
                this.acctypes.push(n);
            }
        }

        this.appStateService.getDatasetAsync().subscribe(
            (ds) => {
                this.dataset = ds;
            }
        );

        this.currencyService.getCurrencies(!this.allcurrencies).subscribe(
            (carray: ICurrencyObject[]) => {
                this.clist = carray.map((c) => {
                    return {
                        id: c.code,
                        text: c.description
                    };
                });
            }
        );

        this.dataSub = this.route.data.subscribe(
            (data: { account: IAccountObject }) => {
                this.account = data.account;
            }
        );

        this.paramSub = this.route.params.subscribe(
            (params: Params) => {
                this.id = params['id'];
                this.mode = params['mode'];
                if (this.mode === 'new') {
                    this.id = undefined;
                    this.account = undefined;
                    if (this.accountForm != null) {
                        this.accountForm.reset();
                    }
                }
            });

        this.loadFormGroup(this.account);

        console.log('Account detail started on mode '
            + this.mode
            + ' and dataset '
            + JSON.stringify(this.account));
    }

    public ngOnDestroy() {
        this.paramSub.unsubscribe();
    }

    public cancel() {
        console.log('cancel');
    }

    public newAccount() {
        console.log('newAccount() ');
        let newAccount: IAccountObject = {
            id: null,
            version: null,
            name: this.accountForm.controls['name'].value,
            description: this.accountForm.controls['description'].value,
            currency: this.accountForm.controls['currency'].value,
            accType: this.accountForm.controls['accType'].value as AccountType,
            balance: undefined
        };
        this.accountService
            .createAccount(this.dataset.id, newAccount)
            .subscribe(
            (data) => {
                console.log('Created account ' + JSON.stringify(data));
                this.alert.success('Created new account');

            },
            (error) => {
                console.log('Error in newAccount() ' + JSON.stringify(error));
                this.alert.error('Account not created');
            });

        this.accountForm.reset();
    }

    // Private methods
    private loadFormGroup(account?: IAccountObject): void {
        this.accountForm = this.formBuilder.group({
            name: [
                account && account.name ? account.name : '',
                Validators.required
            ],
            description: [
                account && account.description ? account.description : '',
                Validators.required
            ],
            currency: [
                account && account.currency ? account.currency : '',
                Validators.required
            ],
            accType: [
                account && account.accType ? account.accType : '',
                Validators.required
            ],
            balance: [
                account && account.balance ? account.balance : '',
                Validators.required
            ]
        });
    }

}
