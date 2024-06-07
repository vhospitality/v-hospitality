import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../../dialog/dialog.component';
import { SelectOptionComponent } from '../../select/select-option/select-option.component';
import { SelectComponent } from '../../select/select.component';
import { SelectService } from '../../select/select.service';

@Component({
  selector: 'app-host-change-reservation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    SelectComponent,
    SelectOptionComponent,
    CalendarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    DropdownModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './host-change-reservation-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./host-change-reservation-dialog.component.scss'],
})
export class HostChangeReservationDialogComponent {
  @Input() data: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  listings: any[] = [
    { name: 'A cozy room in a green apartment', code: 'AU' },
    { name: 'A cozy room in a red apartment', code: 'BR' },
    { name: 'A cozy room in a yellow apartment', code: 'CN' },
    { name: 'A cozy room in a white apartment', code: 'EG' },
  ];
  selectedListing: any;
  checkinDate: any;
  checkoutDate: any;
  selectOption: any[] = [
    {
      id: 1,
      gender: 'Adults',
      desc: 'Ages 13 or above',
      total: 0,
    },
    {
      id: 2,
      gender: 'Children',
      desc: 'Ages 2 - 12',
      total: 0,
    },
    {
      id: 3,
      gender: 'Infants',
      desc: 'Under 2',
      total: 0,
    },
  ];
  loading: boolean = false;
  disabled: boolean = false;

  clickEventSubscription?: Subscription;

  formErrors: any = {
    listing: '',
    start_date: '',
    end_date: '',
  };

  validationMessages: any = {
    listing: {
      required: 'Required.',
    },
    start_date: {
      required: 'Required.',
      matDatepickerParse: 'Not a valid date',
    },
    end_date: {
      required: 'Required.',
      matDatepickerParse: 'Not a valid date',
    },
  };

  constructor(
    private sharedSelect: SelectService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.createForm();

    this.clickEventSubscription = this.sharedSelect
      .getSelectClickEvent()
      .subscribe((data: any) => {
        let findId = this.selectOption.findIndex((x) => x?.id === data?.id);

        if (data?.type === 'add') {
          this.selectOption[findId].total += 1;
        } else if (data?.type === 'minus') {
          if (this.selectOption[findId].total < 1) {
            this.selectOption[findId].total = 0;
          } else {
            this.selectOption[findId].total -= 1;
          }
        }

        this.sharedSelect.setSelectMessage(this.selectOption);
      });
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      listing: ['', [Validators.required]],
    });

    this.feedbackForm.valueChanges.subscribe((data: any) =>
      this.onValueChanged(data)
    );
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  changeDetails() {
    this.openDialog({
      message: 'Successfully changed reservation details',
      requestType: 'success-error',
      requestMessage: '',
    });
  }

  openDialog(data: any) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: 'dialog',
        data: data,
      },
    });
  }
}
