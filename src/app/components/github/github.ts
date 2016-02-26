import {Component, OnInit} from 'angular2/core'
import {GithubService} from '../../services/GithubServices'
import {Repository} from '../models/GithubModels'
import {HTTP_PROVIDERS} from 'angular2/http';

@Component({
    templateUrl: 'app/components/github/github.html',
    styleUrls: ['app/components/github/github.css'],
    providers: [GithubService, HTTP_PROVIDERS]
})
export class Github implements OnInit {

    constructor(private github: GithubService) { }

    repositoryInformation: Repository;
    
    repoLinks;

    ngOnInit() {
        this.github.getRepositoryDetails().subscribe(
            result => this.repositoryInformation = result,
            error  => alert(error),
            () => console.log("HTTP Call Completed")
        );
    }

    getLinks() {
        if (this.repositoryInformation && !this.repoLinks) {
            this.repoLinks=Object.keys(this.repositoryInformation)
                .filter(varname => ['url', 'collaborators', 'comments_url', 'git_url', 'svn_url'].indexOf(varname) != -1)
                .map(varname => { return { name: varname, url: this.repositoryInformation[varname] } });
        }
        
        return this.repoLinks;
    }

}


