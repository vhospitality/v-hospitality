import { CommonModule } from "@angular/common";
import { Component, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router, RouterModule } from "@angular/router";
import { DividerModule } from "primeng/divider";
import { DropdownModule } from "primeng/dropdown";
import { HttpService } from "src/app/global-services/http.service";
import { baseUrl } from "src/environments/environment";
import { DialogComponent } from "../../dialog/dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-dialog-signup-affiliate",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: "./dialog-signup-affiliate.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./dialog-signup-affiliate.component.scss"],
})
export class DialogSignupAffiliateComponent {
  @Input() data: any;

  @ViewChild("fform") feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  feedback: any;
  loading = false;

  formErrors: any = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    experience: "",
  };

  validationMessages: any = {
    firstName: { required: "First Name is required." },
    lastName: { required: "Last Name is required." },
    email: {
      required: "Email is required.",
      email: "Not a valid email.",
    },
    phone: { required: "Phone number is required." },
    website: { required: "Website is required." },
    address: { required: "Address is required." },
    experience: { required: "Experience is required." },
  };

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      address: ["", [Validators.required]],
      experience: ["", [Validators.nullValidator]],
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
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.onValueChanged();
    if (this.feedbackForm.invalid) {
      return;
    }

    this.loading = true;
    this.httpService
      .postData(baseUrl.affiliateSignUp, {
        first_name: this.feedbackForm.value.firstName,
        last_name: this.feedbackForm.value.lastName,
        email: this.feedbackForm.value.email,
        phone: this.feedbackForm.value.phone,
        website: this.feedbackForm.value.website,
        address: this.feedbackForm.value.address,
        experience: this.feedbackForm.value.experience,
      })
      .subscribe({
        next: (data) => {
          this.loading = false;

          this.dialog.closeAll();
          this.notifySuccess();
        },
        error: (err) => {
          this.loading = false;
          console.error("There was an error!", err);
          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              "An error occured!",
            "x",
            {
              duration: 5000,
              panelClass: "error",
              horizontalPosition: "center",
              verticalPosition: "top",
            }
          );
        },
      });
  }

  notifySuccess() {
    this.openDialog({
      message: "Signup successful, we will be in touch",
      requestType: "success-error",
      requestMessage: "",
    });
  }

  openDialog(data: any) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: "dialog",
        data: data,
      },
    });
  }
}
