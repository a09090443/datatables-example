import { Component } from '@angular/core';
import {TableComponent} from "../table/table.component";
import {Item} from "./Item";
import {CommonModule} from "@angular/common";
import {ItemService} from "../service/item.service";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    CommonModule, TableComponent
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  constructor(private itemService:ItemService) {}
  filter: "all" | "active" | "done" = "all";

  allItems = [
    { description: "eat", done: true },
    { description: "sleep", done: false },
    { description: "play", done: false },
    { description: "laugh", done: false },
  ];

  public get hello(): string {
    return 'Hello';
  }
  public get items(): Item[] {
    return this.itemService.getItems();
  }
}
