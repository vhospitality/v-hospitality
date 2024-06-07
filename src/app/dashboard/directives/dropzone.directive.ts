import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

enum DropColor {
  Default = '#FFFFFF', // Default color
  Over = '#ACADAD', // Color to be used once the file is "over" the drop box
}

@Directive({
  selector: '[corpImgUpload]',
  standalone: true,
})
export class DropzoneDirective {
  @HostBinding('class.fileover') fileOver?: boolean;
  @Output() fileDropped = new EventEmitter<any>();
  @HostBinding('style.background') backgroundColor = DropColor.Default;

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
    this.backgroundColor = DropColor.Over;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    this.backgroundColor = DropColor.Default;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    this.backgroundColor = DropColor.Default;
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(evt);
    }
  }
}
