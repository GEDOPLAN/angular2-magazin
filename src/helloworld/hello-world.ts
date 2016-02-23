import {Component} from 'angular2/core'

@Component({
    selector: 'hello-world-app',
    template: 'Say : {{helloText}}'
})
export class HelloWorld{
    helloText:string="Hello World from Angular2"
}

