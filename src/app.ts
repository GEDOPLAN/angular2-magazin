import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {GithubService} from './app/services/GithubServices'

import {App} from './app/angular2-magazin';

bootstrap(App, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    GithubService
])
    .catch(err => console.error(err));