export interface PokeApiResponse {
    count: number;
    previous: string | null;
    results: Pokemon[];
  }
  
  export interface Pokemon {
    name: string;
    url: string;
  }