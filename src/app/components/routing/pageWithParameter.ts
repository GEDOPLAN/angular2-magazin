import {Component} from 'angular2/core'
import {RouteParams} from 'angular2/router';

@Component({
    template: 'pageWithParameter ({{text}})'
})
export class RoutingPageWithParameter {

    text: string;

    constructor(private args: RouteParams) {
        this.text = args.get("text");
    }
}

