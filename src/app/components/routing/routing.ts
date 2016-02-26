import {Component} from 'angular2/core'
import {RoutingPage1} from './page1'
import {RoutingPage2} from './page2'
import {RoutingPageWithParameter} from './pageWithParameter'
import {RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';

@RouteConfig([
    new Route({ path: "/page1", component: RoutingPage1, name: "Page1", 
        useAsDefault: true 
    }),
    new Route({ path: "/page2", component: RoutingPage2, name: "Page2" }),
    new Route({ path: "/page3/:text", component: RoutingPageWithParameter, name: "Page3" })
])
@Component({
    template: ` My Template
                <hr/>
                <a [routerLink]="['Page1']">page1</a> 
                <a [routerLink]="['Page2']">page2</a> 
                <a [routerLink]="['Page3', {text: 'myParameter'}]">page3</a> 
                <br/>
                <router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
export class Routing { }




