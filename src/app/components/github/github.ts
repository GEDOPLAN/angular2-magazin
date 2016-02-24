import {Component, OnInit} from 'angular2/core'
import {GithubService} from '../../services/GithubServices'
import {Repository, RepositoryOwner} from '../models/GithubModels'


@Component({
    templateUrl: 'app/components/github/github.html',
    styleUrls: ['app/components/github/github.css']
})
export class Github implements OnInit {

    constructor(private github: GithubService) { }

    repositoryInformation: Repository;

    ngOnInit() {
        this.github.getRepositoryDetails().subscribe(
            result => this.repositoryInformation = result,
            error  => alert(error),
            () => console.log("HTTP Call Completed")
        );
    }

    getLinks() {
        if (this.repositoryInformation) {
            return Object.keys(this.repositoryInformation)
                .filter(varname => ['url', 'collaborators', 'comments_url', 'git_url', 'svn_url'].indexOf(varname) != -1)
                .map(varname => { return { name: varname, url: this.repositoryInformation[varname] } });
        }
    }

}


