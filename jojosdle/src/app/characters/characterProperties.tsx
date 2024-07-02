export interface CharacterProperties {
  id: string;
  name: string;
  image: string;
  nationality: string;
  family: string;
  chapter: string;
  living: boolean;
  isHuman: boolean;
  comparisonResults: {
    [key: string]: string | undefined; // Index signature allowing any string key
  };
  [key: string]: any;
}
