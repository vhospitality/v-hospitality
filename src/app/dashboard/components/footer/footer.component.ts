import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpService } from 'src/app/global-services/http.service';
import { baseUrl } from 'src/environments/environment';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    MatButtonModule,
  ],
  templateUrl: './footer.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      message: [''],
    });
  }

  onSubmit() {
    this.loading = true;

    this.httpService
      .postData(baseUrl.newsletter, {
        email: this.feedbackForm.value.message,
      })
      .subscribe(
        () => {
          this.loading = false;
          this.service.sendToastClickEvent({
            success: true,
            message: 'Successfully scubscribed to the newsletter',
          });
          this.feedbackFormDirective.resetForm();
        },
        (err) => {
          this.loading = false;
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

  redirectContact() {
    this.router.navigate(['/about']);
    setTimeout(() => {
      this.router.navigate(['/about'], { queryParams: { view: 'contact' } });
    }, 50);
  }
}
