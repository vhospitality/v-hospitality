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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DropzoneDirective } from 'src/app/dashboard/directives/dropzone.directive';
import { baseUrl } from 'src/environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ProgressComponent } from '../../progress/progress.component';

@Component({
  selector: 'app-dialog-signup-upload',
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
    ProgressComponent,
    DropzoneDirective,
  ],
  templateUrl: './dialog-signup-upload.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./dialog-signup-upload.component.scss'],
})
export class DialogSignupUploadComponent {
  @Input() data: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  documents: any[] = [
    {
      document: 'National ID',
      value: 'nin',
    },
    { document: 'Drivers Licence', value: 'drivers_license' },
    { document: 'International Passport', value: 'passport' },
  ];
  loading: boolean = false;
  file: any;
  image: any;
  fileText = 'No file chosen';
  disabled: boolean = false;

  formErrors: any = {
    document: '',
  };

  validationMessages: any = {
    document: {
      required: 'Required.',
    },
  };

  constructor(
    private fb: FormBuilder,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   */
  deleteFile() {
    this.file = undefined;
    this.image = undefined;
  }

  replaceImageExtension(filename: string, format?: string) {
    // Use the `replace` method with a regular expression to replace the extension.
    return filename.replace(/\.[^.]+$/, format || '.jpeg');
  }

  dataURLtoFile(dataurl: any, filename: string, type?: string) {
    let arr = dataurl.split(','),
      // mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: type || 'image/jpeg' });
  }

  resizeImage(imageURL: any, quality: number, imageFile: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      // Check the size of the image file
      let checkSize: any = this.formatBytes(imageFile?.size);
      // If the image size is less than or equal to the specified size, resolve with the original image URL
      if (
        (checkSize?.type == 'KB' || checkSize?.type == 'Bytes') &&
        checkSize?.size <= 100
      ) {
        resolve(imageURL);
        image.src = imageURL;
      } else {
        // If the image size is greater than the specified size, resize the image
        image.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
          // Calculate the aspect ratio of the original image
          const aspectRatio = image.naturalWidth / image.naturalHeight;
          let targetWidth = 800;
          let targetHeight = 800;
          // Calculate new dimensions while maintaining aspect ratio
          let width, height;
          if (targetWidth / aspectRatio > targetHeight) {
            width = targetHeight * aspectRatio;
            height = targetHeight;
          } else {
            width = targetWidth;
            height = targetWidth / aspectRatio;
          }
          // Set the canvas dimensions
          canvas.width = width;
          canvas.height = height;
          // Set the image rendering options for sharpness
          ctx.imageSmoothingQuality = 'high';
          // Clear the canvas
          ctx.clearRect(0, 0, width, height);
          // Draw the resized image on the canvas
          ctx.drawImage(image, 0, 0, width, height);
          let data = canvas.toDataURL('image/jpeg', quality / 100);
          resolve(data);
        };
        image.src = imageURL;
      }
    });
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  async prepareFilesList(files: any) {
    const file = files.target.files[0];
    if (file) {
      let newFile: any = new File(
        [file],
        this.replaceImageExtension(file?.name, '.jpeg'),
        {
          type: 'image/jpeg',
        }
      );
      this.file = newFile;
      this.image = URL.createObjectURL(newFile);
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals?: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      document: ['', [Validators.required]],
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

  async submit() {
    this.onValueChanged();
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
      return;
    } else {
      if (this.file) {
        this.loading = true;
        this.disabled = true;

        let reader: any = new FileReader();
        reader.readAsDataURL(this.file);

        reader.onload = async () => {
          await this.resizeImage(reader.result as string, 99, this.file).then(
            (result: any) => {
              let formData: any = new FormData();
              formData.append(
                'document',
                this.dataURLtoFile(
                  result,
                  this.replaceImageExtension(this.file?.name, '.jpeg')
                )
              );
              formData.append('type', this.feedbackForm.value.document);

              this.httpService
                .postData(baseUrl.verification, formData)
                .subscribe(
                  () => {
                    this.loading = false;
                    this.disabled = false;

                    this.snackBar.open(
                      "Your document has been successfully uploaded. We'll notify you as soon as it's been reviewed.",
                      'x',
                      {
                        duration: 9000,
                        panelClass: 'success',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                      }
                    );
                    this.dialog.closeAll();
                  },
                  (err) => {
                    this.loading = false;
                    this.disabled = false;

                    this.snackBar.open(
                      err?.error?.message ||
                        err?.error?.msg ||
                        err?.error?.detail ||
                        'An error occured, please try again',
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
          );
        };
      } else {
        this.snackBar.open('Please upoad means of identification!', 'x', {
          duration: 5000,
          panelClass: 'error',
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    }
  }
}
