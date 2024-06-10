import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TableModule } from 'primeng/table';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { ExcelService } from '../../../../global-services/excel.service';
import { HttpService } from '../../../../global-services/http.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-earnings-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  providers: [ExcelService],
  templateUrl: './earnings-table.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./earnings-table.component.scss'],
})
export class EarningsTableComponent implements AfterViewInit {
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  earnings: any[] = [];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  total = 0;
  perPage = 15;
  filterObject: any = {};
  transactionType: any[] = [
    { name: 'Booking', code: 'Booking' },
    { name: 'Wallet', code: 'Wallet' },
  ];
  paymentStatus: any[] = [
    { name: 'Success', code: 'success' },
    { name: 'Pending', code: 'pending' },
    { name: 'Failed', code: 'failed' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private httpService: HttpService,
    private dialog: MatDialog,
    private datepipe: DatePipe,
    private excelService: ExcelService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.createForm();
  }

  ngAfterViewInit(): void {
    this.authService.checkExpired();
    this.paginateLoadData();
    this.checkIfHostOrGuest();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      status: [''],
      type: [''],
      search: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  paginateLoadData(event?: any) {
    this.loading = true;
    this.filterObject = {};
    const get_current_page = event?.first + this.perPage || this.perPage;

    if (this.feedbackForm.value.search) {
      Object.assign(this.filterObject, {
        'filter[listing]':
          this.feedbackForm.value.listing || this.feedbackForm.value.search,
      });
    }

    if (this.feedbackForm.value.startDate && this.feedbackForm.value.endDate) {
      Object.assign(this.filterObject, {
        'filter[created_between]': `${this.datepipe.transform(
          this.feedbackForm.value.startDate,
          'YYYY-MM-dd'
        )}|${this.datepipe.transform(
          this.feedbackForm.value.endDate,
          'YYYY-MM-dd'
        )}`,
      });
    }

    if (this.feedbackForm.value.status) {
      Object.assign(this.filterObject, {
        'filter[status]': this.feedbackForm.value.status,
      });
    }

    if (this.feedbackForm.value.type) {
      Object.assign(this.filterObject, {
        'filter[type]': this.feedbackForm.value.type,
      });
    }

    let url = new URLSearchParams(this.filterObject).toString();

    this.httpService
      .getAuthSingle(
        !this.checkIfHostOrGuest()
          ? baseUrl.earnings +
              `/?per_page=${this.perPage}&page=${
                get_current_page / this.perPage
              }&${url}`
          : 'transactions' +
              `/?per_page=${(this, this.perPage)}&page=${
                get_current_page / this.perPage
              }&${url}`
      )
      .subscribe(
        (data: any) => {
          this.earnings = data?.data?.transactions?.data;
          this.total = data?.data?.transactions?.total;
          this.loading = false;
        },
        () => {
          this.authService.checkExpired();
          this.earnings = [];
          this.total = 0;
          this.loading = false;
        }
      );
  }

  clearFilter() {
    this.feedbackFormDirective.resetForm();
    this.paginateLoadData();
  }

  exportCSV(): void {
    let data: any = [];

    for (let n of this.earnings)
      data.push({
        Name: `${n?.user?.first_name} ${n?.user?.last_name}`,
        'Transaction Reference': n?.uuid,
        'Check in': n?.check_in,
        'Check out': n?.check_out,
        'Transaction Status': n?.status,
        'Transaction type': n?.type,
        Amount: n?.amount,
        'Transaction Date': n?.created_at,
      });
    this.excelService.exportAsExcelFile(data, 'TRANSACTIONS');
  }

  checkIfHostOrGuest() {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('CURRENT_USER_TYPE') === null) {
        return false;
      } else {
        let switchGuest = localStorage.getItem('CURRENT_USER_TYPE') as any;
        if (switchGuest === 'true') {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  openDialog(data: any) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'dialog',
        data: data,
      },
    });

    // after dialog close
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
