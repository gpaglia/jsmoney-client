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
    id: string;
    title: string;
    text: string;
};

export type SideMenu = {
    id: string;
    title: string;
    text: string;
    items: SideMenuItem[];
    action: (menu: SideMenu, item: SideMenuItem) => void;
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
    @Input() public activeItemId: string;

    public doAction(menu: SideMenu, item: SideMenuItem) {
        try {
            menu.action(menu, item);
        } catch (error) {
            console.log('Error in sidemenu ' + JSON.stringify(error));
        }
    }
}
