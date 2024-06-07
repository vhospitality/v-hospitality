import { CommonModule, Location } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { InputRestrictionDirective } from 'src/app/dashboard/directives/no-special-character.directive';

@Component({
  selector: 'app-about-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    InputRestrictionDirective,
  ],
  templateUrl: './about-footer.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./about-footer.component.scss'],
})
export class AboutFooterComponent {
  @ViewChild('target', { static: true })
  target!: ElementRef<HTMLDivElement>;

  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading = false;
  disabled = false;
  selectedValues: string[] = [];

  formErrors: any = {
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    message: '',
  };

  validationMessages: any = {
    email: {
      required: 'E-mail is required.',
      email: 'Not a valid email.',
    },
    firstname: {
      required: 'Required.',
      maxlength: 'Not a valid name.',
      minlength: 'Not a valid name.',
    },
    lastname: {
      required: 'Required.',
      maxlength: 'Not a valid name.',
      minlength: 'Not a valid name.',
    },
    phone: {
      required: 'Required.',
      maxlength: 'Not a valid phone number.',
      minlength: 'Not a valid phone number.',
    },
    message: {
      required: 'Required.',
      minlength: 'Message is too short',
    },
  };

  constructor(
    private snackBar: MatSnackBar,
    private _location: Location,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required]],
      // agree: ['ny', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
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
              this.formErrors[field] = messages[key];
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.onValueChanged();
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
      return;
    } else {
      this.loading = true;
      this.disabled = true;
      setTimeout(() => {
        this.loading = false;
        this.disabled = false;
        this.feedbackFormDirective.resetForm();
        this.snackBar.open('Message successfully sent!', 'x', {
          duration: 3000,
          panelClass: 'success',
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }, 3000);
    }
  }

  back() {
    this._location.back();
  }

  redirect(url: string) {
    window.open(url);
  }
}
