import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-second-house-rules',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    SkeletonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './second-house-rules.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./second-house-rules.component.scss'],
})
export class SecondHouseRulesComponent {
  @Input() componentData: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  data: any[] = [];
  houseList: any[] = [];
  error: string = '';
  id: number = 0;
  loading: boolean = false;
  loading2: boolean = false;

  clickEventSubscription?: Subscription;

  formErrors: any = {
    house: '',
  };

  validationMessages: any = {
    house: {
      required: 'Required.',
      pattern: 'Symbols are not allowed',
    },
  };

  constructor(
    private service: ToggleNavService,
    private httpService: HttpService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.authService.checkExpired();
    this.createForm();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.add(data);
      });

    let data: any = this.service.getPropertyMessage();
    this.id = data?.id;

    if (data?.houseRules) {
      this.data = data?.houseRules;
      this.removeDuplicates();
    }

    let houseRules: any = this.service.getHouseRulesMessage();
    if (houseRules) {
      this.houseList = houseRules;
      this.setActivehouseRules();
    } else {
      this.getHouseRules();
    }
  }

  setActivehouseRules() {
    if (this.data) {
      for (let i of this.houseList) {
        let findIndex = this.data?.find(
          (n: any) => n?.toLowerCase() === i?.name?.toLowerCase()
        );

        if (i?.name?.toLowerCase() == findIndex?.toLowerCase()) {
          i.value = true;
        }
      }
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      house: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z\\s\\d]*$')],
      ],
    });

    this.feedbackForm.valueChanges.subscribe(() => this.onValueChanged());
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged() {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
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

  getHouseRules() {
    this.loading2 = true;
    this.httpService.getSingleNoAuth(baseUrl.houseRules).subscribe(
      (data: any) => {
        data?.data.filter((n: any) =>
          this.houseList.push({ name: n?.name, value: false, uuid: n?.uuid })
        );

        this.setActivehouseRules();
        this.service.setHouseRulesMessage(data?.data);
        this.loading2 = false;
      },
      () => {
        this.loading2 = false;
      }
    );
  }

  removeDuplicates() {
    // remove duplicate
    const uniqueYear = [
      ...new Map(
        this.data.map((v: any) => [v?.toLowerCase(), v?.toLowerCase()])
      ).values(),
    ];
    this.data = uniqueYear.map((item) => item);
  }

  changeActive(name: any) {
    let findIndex = this.data?.findIndex(
      (n: any) => n?.toLowerCase() === name?.name?.toLowerCase()
    );

    if (findIndex > -1) {
      this.data.splice(findIndex, 1);

      this.houseList.find((n: any) => {
        if (n?.uuid == name?.uuid) {
          n.value = !n.value;
        }
      });
    } else {
      this.houseList.find((n: any) => {
        if (n?.uuid == name?.uuid) {
          n.value = !n.value;
          this.data.push(name?.name);
        }
      });
    }

    // remove duplicate
    this.removeDuplicates();
  }

  add(type: any) {
    if (type?.componentNumber == 13) {
      this.updateData(type);
    }
  }

  removeHouseRule(index: number, name?: string) {
    if (index > -1) {
      this.data.splice(index, 1);

      let findIndex = this.houseList?.findIndex(
        (n: any) => n?.name?.toLowerCase() === name?.toLowerCase()
      );

      if (findIndex > -1) {
        this.houseList[findIndex].value = false;
      }
    }
  }

  addRule() {
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
      return;
    } else {
      if (this.feedbackForm.value.house) {
        let name = this.feedbackForm.value.house;

        let findIndex = this.data?.findIndex(
          (n: any) => n?.toLowerCase() === name?.toLowerCase()
        );

        let findIndex2 = this.houseList?.findIndex(
          (n: any) => n?.name?.toLowerCase() === name?.toLowerCase()
        );

        if (findIndex2 > -1) {
          this.houseList[findIndex].value = false;
        }

        if (findIndex > -1) {
        } else {
          this.data.push(name);
          this.feedbackFormDirective.resetForm();
        }

        // remove duplicate
        this.removeDuplicates();
      }
    }
  }

  updateData(type: any) {
    this.loading = true;

    let data: any = this.service.getPropertyMessage();

    this.httpService
      .updateData(
        data?.id
          ? baseUrl.draft + '/' + data?.id
          : baseUrl.listing + '/' + data?.uuid,
        {
          house_rules: this.data,
          step: 13,
        }
      )
      .subscribe(
        (data2: any) => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();

          Object.assign(data, {
            houseRules: this.data,
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 13,
          });
        },
        (err) => {
          this.loading = false;
          this.error =
            err?.error?.message ||
            err?.error?.msg ||
            err?.error?.detail ||
            'An error occured, please try again';

          this.service.sendSubmitPropertyClickEvent({
            type: 'error',
          });
        }
      );
  }
}
