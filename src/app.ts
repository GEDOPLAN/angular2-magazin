import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {AppComponent} from './app/angular2-magazin';

//Optional zur Aktivierung der HashLocationStrategy: .../#my/navigation
import {provide}           from 'angular2/core';
import {LocationStrategy, HashLocationStrategy} from 'angular2/router';

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    //provide(LocationStrategy, { useClass: HashLocationStrategy })
])
    .catch(err => console.error(err));