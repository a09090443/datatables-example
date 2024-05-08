import { Routes } from '@angular/router';
import {FoodComponent} from "./food/food.component";
import {TableComponent} from "./table/table.component";
import {ItemComponent} from "./item/item.component";
import {TableExampleComponent} from "./table-example/table-example.component";
import {TableSimpleComponent} from "./table-simple/table-simple.component";

export const routes: Routes = [
  {
    path: 'food',
    component: FoodComponent,
  },
  {
    path: 'table',
    component: TableComponent,
  },
  {
    path: 'table_example',
    component: TableExampleComponent,
  },
  {
    path: 'table_simple',
    component: TableSimpleComponent,
  },
  {
    path: 'item',
    component: ItemComponent,
  }
];
