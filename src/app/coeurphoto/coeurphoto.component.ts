import { Component,OnInit,Input,Output, EventEmitter, } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-coeurphoto',
  templateUrl: './coeurphoto.component.html',
  styleUrl: './coeurphoto.component.scss'
})
export class CoeurphotoComponent implements OnInit{
  likes: number = 0
  @Input() photocontent: any = 0 
  @Output() likeClickedphoto = new EventEmitter<number>();
  
  
    constructor(private login: LoginService) { }
  
  ngOnInit(): void { 
  
  
  
  }
  
  addlikes(){
    console.log('Message ID:', this.photocontent);
    // Logique pour aimer le message ici
  this.login.createlikesphotos(this.photocontent).subscribe((data) => {
    console.log("dataaaaaaaaaaaaaaaaaaaaaa", data)
    this.likes += 1
    this.likeClickedphoto.emit(this.photocontent);
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",this.photocontent)
  });
  
  
  }
  
  
  
  
  
  
  }
  
  
