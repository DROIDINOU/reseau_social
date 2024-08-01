import { Component,OnInit,Input,Output, EventEmitter, } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-coeurvideo',
  templateUrl: './coeurvideo.component.html',
  styleUrl: './coeurvideo.component.scss'
})
export class CoeurvideoComponent implements OnInit{
  likes: number = 0
  @Input() videocontent: any = 0 
  @Output() likeClickedvideo = new EventEmitter<number>();
  
  
    constructor(private login: LoginService) { }
  
  ngOnInit(): void { 
  
  
  
  }
  
  addlikes(){
    console.log('Message ID:', this.videocontent);
    // Logique pour aimer le message ici
  this.login.createlikesvideos(this.videocontent).subscribe((data) => {
    console.log("dataaaaaaaaaaaaaaaaaaaaaa", data)
    this.likes += 1
    this.likeClickedvideo.emit(this.videocontent);
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",this.videocontent)
  });
  
  
  }
  
  
  
  
  
  
  }