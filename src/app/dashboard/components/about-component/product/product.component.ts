import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  lists: any[] = [
    { name: 'Operations Management' },
    { name: 'Human Resource Management' },
    { name: 'Brand and Marketing Management' },
    { name: 'Hotel Accounting' },
    { name: 'Asset Management' },
    { name: 'Financial Management' },
    { name: 'Acquisition & Development' },
    { name: 'Franchising' },
  ];

  lists2: any[] = [{ name: 'V-Hospitality Platform' }];
}
