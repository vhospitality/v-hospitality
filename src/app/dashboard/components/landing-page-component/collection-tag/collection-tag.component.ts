import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-collection-tag',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './collection-tag.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./collection-tag.component.scss'],
})
export class CollectionTagComponent {
  @Output() collection = new EventEmitter<any>();
  active: string = 'all';
  collections: any[] = [];
  datas2: any[] = [];
  filterObject: any = {};
  show: boolean = false;

  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private service: ToggleNavService
  ) {
    let data: any = this.service.getCollectionMessage();

    if (data) {
      this.collections = data;
    } else {
      this.getCollections();
    }
  }

  getCollections() {
    this.datas2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    this.httpService.getSingleNoAuth(baseUrl.collection).subscribe(
      (data: any) => {
        this.datas2 = [];
        this.collections = data?.data;
        this.service.setCollectionMessage(data?.data);
      },
      () => {
        this.datas2 = [];
      }
    );
  }

  chooseCollection(name?: string, uuid?: any) {
    this.active = uuid || 'all';
    Object.assign(this.filterObject, {
      'filter[collection.uuid]': uuid || '',
      collection_name: name,
    });
    this.collection.emit(this.filterObject);
    this.show = true;
  }

  collectedFilter(data: any) {
    this.collection.emit(Object.assign(this.filterObject, data?.object));
  }

  clear() {
    this.filterObject = {};
    this.collectedFilter({ object: { clear: true } });
    this.show = false;
  }

  openDialog() {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'dialog',
        data: {
          requestMessage: 'Filter Search',
          requestType: 'filter-dialog',
          data: this.filterObject,
        },
      },
    });

    // after dialog close
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.loading) {
        if (result?.data?.object?.clear) {
          this.filterObject = {};
          this.clear();
        } else {
          this.show = true;
        }
        this.collectedFilter(result?.data);
      }
    });
  }
}
