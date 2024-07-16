import { Component,OnInit,Input,Output, EventEmitter, } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-coeur',
  templateUrl: './coeur.component.html',
  styleUrl: './coeur.component.scss'
})
export class CoeurComponent implements OnInit{
likes: number = 0
@Input() messagecontent: any = 0 
@Output() likeClicked = new EventEmitter<number>();


  constructor(private login: LoginService) { }

ngOnInit(): void { 



}

addlikes(){
  console.log('Message ID:', this.messagecontent);
  // Logique pour aimer le message ici
this.login.createlikes(this.messagecontent).subscribe((data) => {
  console.log("dataaaaaaaaaaaaaaaaaaaaaa", data)
  this.likes += 1
  this.likeClicked.emit(this.messagecontent);
  console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",this.messagecontent)
});


}






}


