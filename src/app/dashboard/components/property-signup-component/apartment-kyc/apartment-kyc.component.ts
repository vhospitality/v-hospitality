import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DropzoneDirective } from '../../../directives/dropzone.directive';
import { ProgressComponent } from '../../progress/progress.component';

@Component({
  selector: 'app-apartment-kyc',
  standalone: true,
  imports: [
    CommonModule,
    ProgressComponent,
    DropzoneDirective,
    MatProgressSpinnerModule,
  ],
  templateUrl: './apartment-kyc.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./apartment-kyc.component.scss'],
})
export class ApartmentKycComponent {
  @Input() componentData: any;
  files: any = [];
  formData = new FormData();
  arrayBuffer: any;
  projectData: any[] = [];
  fileText = 'No file chosen';
  error: string = '';
  id: number = 0;
  loading: boolean = false;
  new: boolean = false;
  uploadedList: any[] = [];
  currentLoading: string = '';
  cleanedUpload: any[] = [];
  componentNumber: number = 8;
  uploadProgress: any;

  clickEventSubscription?: Subscription;

  constructor(
    public sanitizer: DomSanitizer,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.add(data);
      });

    let data: any = this.service.getPropertyMessage();
    this.id = data?.id;

    if (data?.document?.files) {
      for (let f of data?.document?.files) {
        this.files.push({
          url: f?.url || f,
          uuid: f?.uuid,
          name: f?.name || f?.uuid || f?.url,
          data: f,
          size: 100,
          data2: f?.data,
          serverImage: true,
          base64: f?.base64,
          orientation: f?.orientation,
        });
      }
    }
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
    this.files = [];
    this.files['progress'] = 100;
    this.fileText = '';
    this.projectData = [];
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(file: any, index: number) {
    setTimeout(() => {
      if (file['progress'] === 100) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (file['progress'] === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(file, index + 1);
          } else {
            file['progress'] += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  async prepareFilesList(event: any) {
    const file: File[] = event.target.files || event.dataTransfer.files;

    for await (let f of file as any) {
      f['progress'] = 0;

      this.files.push({
        url: URL.createObjectURL(f),
        uuid: f?.uuid,
        name: f?.name,
        data: f,
        serverImage: false,
        base64: undefined,
        orientation: undefined,
      });
    }
    await this.removeDuplicates();
    this.new = true;
  }

  async removeDuplicates() {
    for await (let f of this.files) {
      let index2 = this.files.filter(
        (x: any) =>
          x?.name?.replaceAll(/\s/g, '') === f?.name?.replaceAll(/\s/g, '')
      );

      if (index2.length > 1 && index2[0]?.name) {
        this.files.splice(
          this.files.findIndex((x: any) => x?.name == index2[0]?.name),
          1
        );
      } else {
        this.uploadFilesSimulator(f?.data, 0);
      }
    }

    if (this.files.length >= 1) {
      this.error = '';
    } else {
      this.error = 'Please upload at least one (1) document';
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

  add(type: any) {
    if (type?.componentNumber == 8) {
      if (this.files?.length >= 1) {
        this.postData(type);
      } else {
        this.error = 'Please upload photo to verify your property';
      }
    }
  }

  checkIfUploaded(data: any) {
    return this.uploadedList.find((x: any) => x?.url == data?.url)?.failed;
  }

  deleteImage(index: number) {
    if (!this.currentLoading) {
      this.files.splice(index, 1);

      const check_if_server_image_exist = this.files.find(
        (n: any) => n?.serverImage === false
      );

      if (this.files?.length <= 0 || check_if_server_image_exist == undefined) {
        this.new = false;
      }
    } else {
      this.snackBar.open('Please wait!', 'x', {
        duration: 3000,
        panelClass: 'warning',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  deleteImageFromServer(data2: any, index: number) {
    if (!this.currentLoading) {
      let data: any = this.service.getPropertyMessage();
      this.currentLoading = data2?.url;

      this.httpService
        .deleteData(
          data?.id
            ? `${baseUrl.draft}/${data?.id}/pictures/${data2?.uuid}`
            : `${baseUrl.listing}/${data?.uuid}/pictures/${data2?.uuid}`,
          ''
        )
        .subscribe(
          (data2: any) => {
            this.currentLoading = '';
            this.deleteImage(index);
          },
          (err) => {
            this.currentLoading = '';
            this.error =
              err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              'An error occured, please try again';
          }
        );
    } else {
      this.snackBar.open('Please wait!', 'x', {
        duration: 3000,
        panelClass: 'warning',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  async uploadImage(type: any) {
    let data: any = this.service.getPropertyMessage();
    this.currentLoading = this.cleanedUpload[0]?.url;

    let formData: any = new FormData();
    formData.append('document', this.cleanedUpload[0]?.data);
    formData.append('step', this.componentNumber);

    this.httpService
      .postImage(
        data?.id
          ? `${baseUrl.draft}/${data?.id}/pictures`
          : `${baseUrl.listing}/${data?.uuid}/pictures`,
        formData
      )
      .subscribe(
        (progress: any) => {
          if (progress?.data) {
            this.cleanedUpload.shift();

            let getIndex = this.files.findIndex(
              (x: any) => x?.url == this.currentLoading
            );

            if (getIndex != -1) {
              this.files[getIndex].serverImage = true;
              this.files[getIndex].uuid = progress?.data?.uuid;
            }

            this.uploadedList.push({
              failed: false,
              url: this.currentLoading,
            });

            this.uploadProgress = {
              progress: 0,
              id: this.currentLoading,
            };

            if (this.cleanedUpload.length > 0) {
              this.uploadImage(type);
            } else {
              this.currentLoading = '';
              this.uploadProgress = undefined;
              if (this.uploadedList.find((x: any) => x?.failed === true)) {
                return;
              } else {
                this.addDataToService(type);
              }
            }
          } else {
            this.uploadProgress = {
              progress: progress,
              id: this.currentLoading,
            };
          }
        },
        (err) => {
          this.cleanedUpload.shift();

          if (this.cleanedUpload.length > 0) {
            this.uploadedList.push({
              failed: true,
              url: this.currentLoading,
            });
            this.uploadImage(type);
          } else {
            this.currentLoading = '';
          }

          this.uploadProgress = undefined;

          this.error =
            err?.error?.message ||
            err?.error?.msg ||
            err?.error?.detail ||
            'An error occured, please try again';
        }
      );
  }

  async postData(type: any) {
    if (!this.currentLoading) {
      this.cleanedUpload = [];

      for await (let f of this.files) {
        if (!f?.serverImage || f?.serverImage === false) {
          this.cleanedUpload.push(f);
        }
      }

      if (this.cleanedUpload.length > 0 || this.new) {
        await this.uploadImage(type);
      } else {
        this.addDataToService(type);
      }
    }
  }

  addDataToService(type: any) {
    let data: any = this.service.getPropertyMessage();
    Object.assign(data, {
      document: {
        files: this.files,
      },
    });
    this.service.setPropertyMessage(data);
    this.service.sendSubmitPropertyClickEvent({
      type: type?.type,
      componentNumber: this.componentNumber,
    });
  }

  ngOnDestroy() {
    this.files = [];
  }
}
