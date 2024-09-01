export interface CharactersProperties {
  id: string;
  name: string;
  image: string;
  nationality: string;
  animeDebut: number;
  chapter: string;
  living: boolean;
  isHuman: boolean;
  isStandUser: boolean;
  gender: string;
  comparisonResults?: {
    [key: string]: string | undefined; // Index signature allowing any string key
  };
  [key: string]: any;
}
