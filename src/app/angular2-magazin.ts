import {Component} from 'angular2/core';
import {Router, Route, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Home} from './components/home/home'
import {HelloWorld} from './components/helloworld/helloworld'
import {Gulp} from './components/gulp/gulp'


@Component({
    selector: 'app',
    providers: [],
    templateUrl: 'app/template.html',
    directives: [ROUTER_DIRECTIVES],
    pipes: []
})
@RouteConfig([
        new Route({ path: '/home', component: Home, name: 'Home', useAsDefault: true}),
        new Route({ path: '/helloworld', component: HelloWorld, name: 'HelloWorld'}),
        new Route({ path: '/build', component: Gulp, name: 'Gulp'}),
])
export class App {

    constructor() { }

}
