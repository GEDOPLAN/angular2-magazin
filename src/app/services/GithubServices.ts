import {Injectable}     from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {Repository} from '../components/models/GithubModels'

@Injectable()
export class GithubService {

    constructor(private http: Http) { }

    getRepositoryDetails(): Observable<Repository> {
        return this.http
            .get("https://api.github.com/repos/dominikmathmann/angular2_magazin")
            .map(res => res.json());
    }
}