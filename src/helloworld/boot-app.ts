import {bootstrap} from 'angular2/platform/browser';

import {HelloWorld} from './hello-world';

bootstrap(HelloWorld, [])
  .catch(err => console.error(err));