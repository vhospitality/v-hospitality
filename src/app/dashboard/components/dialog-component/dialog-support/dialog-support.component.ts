import { CommonModule } from "@angular/common";
import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
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
import { RouterModule } from "@angular/router";
import { HttpService } from "src/app/global-services/http.service";
import { baseUrl } from "src/environments/environment";
import { DialogComponent } from "../../dialog/dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-dialog-support",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: "./dialog-support.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./dialog-support.component.scss"],
})
export class DialogSupportComponent {
  @ViewChild("fform") supportFormDirective: any;
  supportForm: any = FormGroup;
  loading = false;

  supportTopics = [
    { value: "host-signup", label: "Signing up as a host" },
    { value: "add-property", label: "Adding a property" },
    { value: "other", label: "Other" },
  ];

  contactMethods = [
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
  ];

  formErrors: any = {
    fullName: "",
    email: "",
    phone: "",
    supportTopic: "",
    propertyLocation: "",
    contactMethod: "",
    comments: "",
  };

  validationMessages: any = {
    fullName: {
      required: "Full name is required.",
    },
    email: {
      required: "Email is required.",
      email: "Please enter a valid email address.",
    },
    phone: {
      required: "Phone number is required.",
      pattern: "Please enter a valid phone number.",
    },
    supportTopic: {
      required: "Please select a support topic.",
    },
    propertyLocation: {
      required: "Property location is required when adding a property.",
    },
    contactMethod: {
      required: "Please select your preferred contact method.",
    },
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  createForm() {
    this.supportForm = this.fb.group({
      fullName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern("^[0-9+()-\\s]*$")]],
      supportTopic: ["", [Validators.required]],
      propertyLocation: [""],
      contactMethod: ["", [Validators.required]],
      comments: [""],
    });

    // Add conditional validation for propertyLocation
    this.supportForm
      .get("supportTopic")
      ?.valueChanges.subscribe((topic: any) => {
        const propertyLocationControl =
          this.supportForm.get("propertyLocation");
        if (topic === "add-property") {
          propertyLocationControl?.setValidators([Validators.required]);
        } else {
          propertyLocationControl?.clearValidators();
        }
        propertyLocationControl?.updateValueAndValidity();
      });

    this.supportForm.valueChanges.subscribe(() => this.onValueChanged());
    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.supportForm) return;

    const form = this.supportForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && !control.valid && control.touched) {
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
    if (this.supportForm.valid) {
      this.loading = true;
      // Here you would typically call your support service
      console.log("Form submitted:", this.supportForm.value);
      // Simulate API call
      this.httpService
        .postData(baseUrl.supportUrl, {
          comments: this.supportForm.value.comments,
          contact_method: this.supportForm.value.contactMethod,
          email: this.supportForm.value.email,
          phone: this.supportForm.value.phone,
          full_name: this.supportForm.value.fullName,
          property_location: this.supportForm.value.propertyLocation,
          support_topic: this.supportForm.value.supportTopic,
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
    } else {
      Object.keys(this.supportForm.controls).forEach((key) => {
        const control = this.supportForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  closeDialog() {
    this.dialog.closeAll();
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
