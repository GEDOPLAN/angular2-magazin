import {Component} from 'angular2/core'
import {Comment} from '../models/GithubModels'

@Component({
    templateUrl: 'app/components/form/form.html',
    styleUrls: ['app/components/form/form.css']
})
export class Form{
    comment: Comment
    comments: Comment[]

    constructor() { 
        this.comment=new Comment();
        this.comments = this.loadComments();
    }

    clearComment() {
        this.comment = new Comment();
    }

    addComment() {
        this.comments.push(this.comment);
        this.saveComments(this.comments);
        this.clearComment();
    }

    loadComments(): Comment[] {
        if (!this.comments) {
            var jsonString=sessionStorage.getItem("ng2magazin-comments");
            this.comments = jsonString ? JSON.parse(jsonString): [];
        }

        return this.comments;
    }

    saveComments(comments: Comment[]) {
        sessionStorage.setItem("ng2magazin-comments", JSON.stringify(comments));
    }



}


