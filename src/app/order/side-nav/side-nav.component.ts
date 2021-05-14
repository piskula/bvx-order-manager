import {Component} from '@angular/core';
import {OrderService} from '../../service/order.service';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';

interface NavigationNode {
  name: string;
  routeLink?: string;
  icons?: string[];
  children?: NavigationNode[];
}

const TREE_DATA: NavigationNode[] = [
  {
    name: 'Invoices',
    children: [
      {name: 'Regular', routeLink: '/invoice/list'},
      {name: 'Proforma', routeLink: '/invoice/list/proforma'},
    ]
  },
  {
    name: 'Orders',
    children: [
      {name: 'All', routeLink: '/order/list'},
      {name: 'Na odoslanie', routeLink: '/order/list/processing', icons: ['local_shipping']},
      {name: 'On-hold', routeLink: '/order/list/on-hold', icons: ['money_off']},
      {name: 'Cancelled', routeLink: '/order/list/cancelled', icons: ['block']},
    ]
  },
];

interface FlatNode {
  expandable: boolean;
  name: string;
  icons: string[];
  level: number;
  routeLink: string;
}

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  providers: [OrderService],
})
export class SideNavComponent {

  private transformer = (node: NavigationNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      icons: node.icons || [],
      routeLink: node.routeLink,
      level,
    };
  }

  // tslint:disable-next-line
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  // tslint:disable-next-line
  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  // tslint:disable-next-line
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
    this.treeControl.expandAll();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

}
