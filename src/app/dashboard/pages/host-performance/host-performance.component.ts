import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'app-host-performance',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
    LineChartComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    MatButtonModule,
    CalendarModule,
    BackButtonComponent,
  ],
  templateUrl: './host-performance.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./host-performance.component.scss'],
})
export class HostPerformanceComponent {
  currentType: string = 'overall quality';
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;

  occupancy: any = [
    {
      title: 'Average occupancy rate',
      percentage: '200%',
      tagPercentage: 22,
      tag: '%',
    },
    {
      title: 'Average nights booked',
      percentage: '200%',
      tagPercentage: 2,
      tag: '%',
    },
    {
      title: 'Average nights blocked',
      percentage: '200%',
      tagPercentage: 2,
      tag: '%',
    },
    {
      title: 'Average unbooked nights',
      percentage: '200%',
      tagPercentage: 22,
      tag: '%',
    },
  ];

  quality: any = [
    {
      title: '5-star ratings',
      percentage: '200%',
      tagPercentage: 22,
      tag: '%',
    },
    {
      title: 'Overall rating',
      percentage: '2.5',
      tagPercentage: 2,
      tag: 'pts',
    },
  ];

  conversion: any = [
    {
      title: 'Average overall conversion rate',
      percentage: '200%',
      tagPercentage: 22,
      tag: '%',
    },
    {
      title: 'First-page search impression rate',
      percentage: '200%',
      tagPercentage: 2,
      tag: '%',
    },
    {
      title: 'Average search-to-listing conversion',
      percentage: '200%',
      tagPercentage: 2,
      tag: '%',
    },
    {
      title: 'Average listing-to-booking conversion',
      percentage: '200%',
      tagPercentage: 22,
      tag: '%',
    },
  ];

  chartData: any = {
    leftText: 'Percentage rating',
    data: {
      first: {
        year: '2020',
        data: [
          [1000, false],
          [1200, false],
          [1300, false],
          [1400, false],
          [1500, false],
          [1600, false],
          [1700, false],
          [1800, false],
          [1900, false],
          [1910, false],
          [1920, false],
          [1930, false],
        ],
      },
      second: {
        year: '2023',
        data: [
          [100, false],
          [200, false],
          [300, false],
          [400, false],
          [500, false],
          [600, false],
          [700, false],
          [800, false],
          [900, false],
          [1000, false],
          [1100, false],
          [1120, false],
        ],
      },
    },
  };

  listings: any[] = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
  ];
  selectedlisting: any;
  earningsMonth: any[] = [
    {
      month: '12 months',
    },
    {
      month: '30 days',
    },
    {
      month: '7 days',
    },
    {
      month: '24 hours',
    },
  ];
  earningsMonthActive: string = '';

  constructor(
    private fb: FormBuilder,
    private service: ToggleNavService,
    private dialog: MatDialog
  ) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      startDate1: [''],
      endDate1: [''],
      startDate2: [''],
      endDate2: [''],
      compare: [''],
    });
  }

  selectMonthActive(m: any): void {
    this.earningsMonthActive = m?.month;
  }

  changeType(type: string) {
    this.currentType = type;
  }
}
