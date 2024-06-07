import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarningsTableComponent } from '../../components/earnings-component/earnings-table/earnings-table.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule,
    EarningsTableComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './transaction-history.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent {}
