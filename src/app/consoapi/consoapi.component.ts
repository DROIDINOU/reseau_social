import { Component } from '@angular/core';
import {PokeApiResponse } from '../poke';
import { PokeapiService } from '../pokeapi.service';
@Component({
  selector: 'app-consoapi',
  templateUrl: './consoapi.component.html',
  styleUrl: './consoapi.component.scss'
})
export class ConsoapiComponent {
  posts: PokeApiResponse | undefined;
  postbis : PokeApiResponse | undefined;
  offset:number = 0;
  limit:number = 20;
  constructor(private pokeService: PokeapiService) { }

  ngOnInit(): void {
    this.fetchPokemon();
  }

  fetchPokemon(): void {
    this.pokeService.getPokemon(this.offset, this.limit).subscribe((data) => {
      this.posts = data;
      console.log(this.posts)
    });
  }

  getsample(): void{
   this.pokeService.getsample().subscribe((data)=>{
   this.postbis = data;
   console.log(this.postbis.count)
  });
  }

  nextPage(): void {
    this.offset += this.limit;
    this.fetchPokemon();
  }

  previousPage(): void {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.fetchPokemon();
    }
  }


}