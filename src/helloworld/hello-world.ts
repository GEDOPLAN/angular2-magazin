import {Component} from 'angular2/core'

@Component({
    template: '<p>{{helloText}}</p>',
    selector: 'hello-world-app'
})
export class HelloWorld{
    helloText:string="Hello World from Angular2"
}

