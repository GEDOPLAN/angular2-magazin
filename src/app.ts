import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {GithubService} from './app/services/GithubServices'

import {App} from './app/angular2-magazin';

//Optional zur Aktivierung der HashLocationStrategy: .../#my/navigation
import {provide}           from 'angular2/core';
import {LocationStrategy, HashLocationStrategy} from 'angular2/router';

bootstrap(App, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    GithubService,
    //provide(LocationStrategy, { useClass: HashLocationStrategy })
])
    .catch(err => console.error(err));