/*
 * Angular 2 decorators and services
 */
import {
    Component,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
    Input
} from '@angular/core';

import {
    AlertService,
    AlertMessage
} from '../../../../_app-services';

export type SideMenuItem = {
    title: string,
    text: string,
    action: (item: SideMenuItem) => void;
};

export type SideMenu = {
    title: string,
    text: string,
    items: SideMenuItem[];
};

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'my-sidenav',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './sidenav.component.css'
    ],
    templateUrl: './sidenav.component.html'
})
export class SidenavComponent {
    @Input() public menuStructure: SideMenu;

    public onclick(menuItem: SideMenuItem) {
        try {
            menuItem.action(menuItem);
        } catch (error) {
            console.log('Error in sidemenu ' + JSON.stringify(error));
        }
    }

}
