export interface Card {
  name: string;
  number: string;
  format: string;
  color: color;
  key?: number;
}
export interface color {
  red: number;
  green: number;
  blue: number;
}
