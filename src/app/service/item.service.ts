import { Injectable } from '@angular/core';
import {Item} from "../item/Item";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  public getItems(): Item[] {
    return [
      { description: "Test" , done: true },
      { description: "sleep", done: false },
      { description: "play", done: false },
      { description: "laugh", done: false },
    ];
  }
}
