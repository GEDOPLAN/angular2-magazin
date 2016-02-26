import {Component} from 'angular2/core';
import {Router, Route, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Home} from './components/home/home'
import {HelloWorld} from './components/helloworld/helloworld'
import {Gulp} from './components/gulp/gulp'
import {Form} from './components/form/form'
import {Github} from './components/github/github'
import {Routing} from './components/routing/routing'


@Component({
    selector: 'app',
    providers: [],
    templateUrl: 'app/template.html',
    directives: [ROUTER_DIRECTIVES],
    pipes: []
})
@RouteConfig([
        new Route({ path: '/home', component: Home, name: 'Home', useAsDefault: true}),
        new Route({ path: '/hello', component: HelloWorld, name: 'HelloWorld'}),
        new Route({ path: '/forms', component: Form, name: 'Form'}),
        new Route({ path: '/services', component: Github, name: 'Github'}),
        new Route({ path: '/routing/...', component: Routing, name: 'Routing'}),
        new Route({ path: '/build', component: Gulp, name: 'Gulp'}),
])
export class App {

    constructor() { }

}
