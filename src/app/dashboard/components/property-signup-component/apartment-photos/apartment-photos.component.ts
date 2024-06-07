import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DropzoneDirective } from '../../../directives/dropzone.directive';

@Component({
  selector: 'app-apartment-photos',
  standalone: true,
  imports: [
    CommonModule,
    LazyLoadImageModule,
    MatButtonModule,
    DropzoneDirective,
    MatProgressSpinnerModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    CdkDragPreview,
  ],
  templateUrl: './apartment-photos.component.html',
  // providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }],
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./apartment-photos.component.scss'],
})
export class ApartmentPhotosComponent implements OnDestroy {
  @Input() componentData: any;
  formData = new FormData();
  image: any;
  filename: any;
  errorText: string = '';
  files: any[] = [];
  activeFilename: any;
  error: string = '';
  id: number = 0;
  uploadedList: any[] = [];
  currentLoading: string = '';
  cleanedUpload: any[] = [];
  defaultImage = baseUrl.defaultImage;
  componentNumber: number = 7;
  new: boolean = false;
  datas: any;

  clickEventSubscription?: Subscription;

  constructor(
    public sanitizer: DomSanitizer,
    private authService: AuthService,
    private service: ToggleNavService,
    private snackBar: MatSnackBar,
    private httpService: HttpService // private imageCompress: NgxImageCompressService
  ) {
    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.add(data);
      });

    let data: any = this.service.getPropertyMessage();
    this.datas = data;
    this.id = data?.id;

    if (data?.photos?.files) {
      for (let f of data?.photos?.files) {
        this.files.push({
          url: f?.url || f,
          uuid: f?.uuid,
          name: f?.name || f?.uuid || f?.url,
          data: f,
          serverImage: true,
          base64: f?.base64,
          orientation: f?.orientation,
        });
      }
      this.setDefaultImage();
    }
  }

  async onFileSelected(event: any) {
    const file: File[] = event.target.files || event.dataTransfer.files;

    this.image = [];
    this.filename = [];

    for await (let f of file as any) {
      let newFile: any = new File(
        [f],
        this.replaceImageExtension(f?.name, '.jpeg'),
        {
          type: 'image/jpeg',
        }
      );
      this.files.push({
        url: URL.createObjectURL(newFile),
        uuid: newFile?.uuid,
        name: newFile?.name,
        data: newFile,
        serverImage: false,
        base64: undefined,
        orientation: undefined,
      });
    }
    await this.removeDuplicates();
    await this.setDefaultImage();
    this.new = true;
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any) {
    if (bytes === 0) {
      return 'Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return {
      type: sizes[i],
      size: Math.floor(bytes / k),
    };
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
        this.setDefaultImage();
      }
    }

    if (this.files.length >= 5) {
      this.error = '';
    } else {
      this.error = 'Please upload at least five (5) photos';
      this.snackBar.open('Please upload at least five (5) photos', 'x', {
        duration: 5000,
        panelClass: 'error',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  changeActiveImage(data: any) {
    this.activeFilename = data?.url;
    this.filename = data;
    this.image = data;
  }

  async setDefaultImage() {
    this.activeFilename = this.files[0]?.url;
    this.filename = this.files[0]?.name;
    this.image = this.files[0];
  }

  add(type: any) {
    if (type?.componentNumber == this.componentNumber) {
      if (this.files.length >= 5) {
        this.postData(type);
      } else {
        this.error = 'Please upload at least five (5) photos';
      }
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.files, event.previousIndex, event.currentIndex);
    this.setDefaultImage();
  }

  deleteImage(index: number) {
    if (!this.currentLoading) {
      this.files.splice(index, 1);

      if (this.files?.length <= 0) {
        this.activeFilename = undefined;
        this.filename = undefined;
        this.image = undefined;
      } else {
        this.setDefaultImage();
      }

      const check_if_server_image_exist = this.files.find(
        (n: any) => n?.serverImage === false
      );

      if (this.files?.length <= 0 || check_if_server_image_exist == undefined) {
        this.new = false;
      }
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
    }
  }

  checkIfUploaded(data: any) {
    return this.uploadedList.find((x: any) => x?.url == data?.url)?.failed;
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
    return new File([u8arr], filename, { type: type || 'image/webp' });
  }

  resizeImage(imageURL: any, quality: number, imageFile: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();

      // Check the size of the image file
      let checkSize: any = this.formatBytes(imageFile?.size);

      // If the image size is less than or equal to the specified size, resolve with the original image URL
      if (
        (checkSize?.type == 'KB' || checkSize?.type == 'Bytes') &&
        checkSize?.size <= 200
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

          // Set the image smoothing quality

          // Set the image rendering options for sharpness
          ctx.imageSmoothingQuality = 'high';

          // Clear the canvas
          ctx.clearRect(0, 0, width, height);

          // Draw the resized image on the canvas
          ctx.drawImage(image, 0, 0, width, height);

          // Convert the canvas content to a data URL with the specified quality
          let data = canvas.toDataURL('image/webp', quality / 100);

          // Resolve with the resized image data URL
          resolve(data);
        };

        // Set the image source to trigger the onload event
        image.src = imageURL;
      }
    });
  }

  replaceImageExtension(filename: string, format?: string) {
    // Use the `replace` method with a regular expression to replace the extension.
    return filename.replace(/\.[^.]+$/, format || '.webp');
  }

  async uploadImage(type: any) {
    let data: any = this.service.getPropertyMessage();
    this.currentLoading = this.cleanedUpload[0]?.url;

    let reader: any = new FileReader();
    reader.readAsDataURL(this.cleanedUpload[0]?.data);

    reader.onload = async () => {
      await this.resizeImage(
        reader.result as string,
        99,
        this.cleanedUpload[0]?.data
      ).then(
        (result: any) => {
          let formData: any = new FormData();
          formData.append(
            'files[]',
            this.dataURLtoFile(
              result,
              this.replaceImageExtension(this.cleanedUpload[0]?.name)
            )
          );
          formData.append('step', this.componentNumber);

          this.httpService
            .postData(
              data?.id
                ? `${baseUrl.draft}/${data?.id}/pictures`
                : `${baseUrl.listing}/${data?.uuid}/pictures`,
              formData
            )
            .subscribe(
              (data2: any) => {
                this.cleanedUpload.shift();

                let getIndex = this.files.findIndex(
                  (x: any) => x?.url == this.currentLoading
                );

                if (getIndex != -1) {
                  this.files[getIndex].serverImage = true;
                  this.files[getIndex].uuid = data2?.uuid;
                }

                this.uploadedList.push({
                  failed: false,
                  url: this.currentLoading,
                });

                if (this.cleanedUpload.length > 0) {
                  this.uploadImage(type);
                } else {
                  this.currentLoading = '';
                  if (this.uploadedList.find((x: any) => x?.failed === true)) {
                    return;
                  } else {
                    this.addDataToService(type);
                  }
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
                this.error =
                  err?.error?.message ||
                  err?.error?.msg ||
                  err?.error?.detail ||
                  'An error occured, please try again';
              }
            );
        },
        (err) => {}
      );
    };
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
      photos: {
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
