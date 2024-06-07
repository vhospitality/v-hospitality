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
import { MatSelectModule } from '@angular/material/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-describe-place',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    SkeletonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './describe-place.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./describe-place.component.scss'],
})
export class DescribePlaceComponent {
  @Input() componentData: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  collections: any[] = [];
  active: string = '';
  error: string = '';
  loading: boolean = false;
  componentNumber: number = 1;

  data: any = [
    { name: 'house/villa', value: false },
    { name: 'apartment', value: false },
    { name: 'studio', value: false },
    { name: 'condo', value: false },
    { name: 'beachfront', value: false },
  ];

  clickEventSubscription?: Subscription;

  formErrors: any = {
    collection_id: '',
  };

  validationMessages: any = {
    collection_id: {
      required: 'Required.',
    },
  };

  constructor(
    private service: ToggleNavService,
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.add(data);
      });

    this.createForm();

    let data: any = this.service.getPropertyMessage();
    let collections: any = this.service.getCollectionMessage();

    if (collections) {
      this.collections = collections;
    } else {
      this.getCollections();
    }

    if (data?.describePlace) {
      // this.active = data?.describePlace?.home_type || 'house';
      this.active = data?.describePlace?.collection_id || '';
      this.feedbackForm.patchValue({
        collection_id: data?.describePlace?.collection_id,
      });
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      collection_id: ['', [Validators.required]],
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

  changeActive(name: string) {
    this.active = name;
  }

  getCollections() {
    this.httpService.getSingleNoAuth(baseUrl.collection).subscribe(
      (data: any) => {
        this.collections = data?.data;
        this.service.setCollectionMessage(data?.data);
      },
      (err) => {}
    );
  }

  add(type: any) {
    if (type?.componentNumber == this.componentNumber) {
      let data: any = this.service.getPropertyMessage();

      if (this.active) {
        if (data?.describePlace?.collection_id) {
          this.updateData(type);
        } else {
          this.postData(type);
        }
      } else {
        this.error = 'Please select collection!';
        this.service.sendSubmitPropertyClickEvent({
          type: 'error',
        });
      }
    }
    // }
  }

  postData(type: any) {
    this.loading = true;

    this.httpService
      .postData(baseUrl.draft, {
        // collection_id: this.feedbackForm.value.collection_id,
        // home_type: 'apartment',
        collection_id: this.active,
      })
      .subscribe(
        (data2: any) => {
          this.loading = false;

          let data: any = this.service.getPropertyMessage();
          if (data?.describePlace) {
            Object.assign(data, {
              describePlace: {
                // home_type: this.active,
                // collection_id: this.feedbackForm.value.collection_id,
                collection_id: this.active,
              },
            });
          } else {
            data = {};
            Object.assign(data, {
              id: data2?.data?.id,
              describePlace: {
                // home_type: this.active,
                // collection_id: this.feedbackForm.value.collection_id,
                collection_id: this.active,
              },
            });
          }

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: this.componentNumber,
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

  updateData(type: any) {
    this.loading = true;

    let data: any = this.service.getPropertyMessage();

    this.httpService
      .updateData(
        data?.id
          ? baseUrl.draft + '/' + data?.id
          : baseUrl.listing + '/' + data?.uuid,
        {
          collection_id: this.active || data?.describePlace?.collection_id,
          step: 1,
        }
      )
      .subscribe(
        (data2: any) => {
          this.loading = false;

          let data: any = this.service.getPropertyMessage();
          Object.assign(data, {
            describePlace: {
              collection_id: this.active || data?.describePlace?.collection_id,
            },
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: this.componentNumber,
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
