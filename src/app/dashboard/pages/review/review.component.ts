import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { baseUrl } from '../../../../environments/environment';
import { HttpService } from '../../../global-services/http.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    RatingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    BackButtonComponent,
  ],
  templateUrl: './review.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
  currentId: any = { id: 1 };
  cleanValue: number = 3;
  comunicationValue: number = 3;
  rulesValue: number = 3;
  // expectationValue: number = 0;
  loading: boolean = false;
  disabled: boolean = false;
  data: any;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private httpService: HttpService,
    private router: Router,
    private direct: ActivatedRoute
  ) {
    this.direct.paramMap.subscribe((params) => {
      let id: any = params.get('id');
      this.data = JSON.parse(atob(id));
    });
  }

  questions: any[] = [
    { name: 'Much better than I expected', id: 1 },
    { name: 'A bit better than I expected', id: 2 },
    { name: 'About the same as I expected', id: 3 },
    { name: 'Much worse than I expected', id: 4 },
  ];

  onSubmit() {
    this.loading = true;
    this.disabled = true;

    this.httpService
      .postData(baseUrl.listing + `/${this.data?.listing_uuid}/reviews`, {
        booking_uuid: this.data?.booking_uuid,
        cleanliness: this.cleanValue,
        communication: this.comunicationValue,
        observance_of_house_rules: this.rulesValue,
        expectations: this.currentId?.id,
        experience: this.currentId?.name,
        feedback: this.currentId?.name,
        type: 'private',
      })
      .subscribe(
        () => {
          this.loading = false;
          this.disabled = false;

          this.openDialog(
            {
              message: 'Thank you for your feedback!',
              requestType: 'success-error',
              requestMessage: '',
            },
            'dialog'
          );

          this.router.navigate(['/home']);
        },
        (err) => {
          this.loading = false;
          this.disabled = false;

          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              'An error occured!',
            'x',
            {
              duration: 5000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
  }

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
  }
}
