import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { HttpService } from "src/app/global-services/http.service";
import { baseUrl } from "src/environments/environment";
import { FormsModule } from "@angular/forms";
import * as moment from "moment";
import { Router } from "@angular/router";

@Component({
  selector: "app-toggle-date-dialog",
  standalone: true,
  templateUrl: "./toggle-date-dialog.component.html",
  styleUrls: ["./toggle-date-dialog.component.scss"],
  imports: [CommonModule, NgMultiSelectDropDownModule, FormsModule],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ToggleDateDialogComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private route: Router
  ) {}

  @Input() data: any;

  loading = false;

  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};
  selectedIds: any[] = [];

  ngOnInit() {
    // console.log("just blockedDate", this.data.data.data.data.listings);
    console.log("just data", this.data);

    this.getListing();
    this.dropdownList;

    this.selectedItems = [];

    console.log("selected item", this.selectedItems);

    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    this.selectedIds.push(item.item_id);
    console.log(item);
  }

  onItemDeSelect(item: any) {
    console.log("onDeSelect", item);

    this.selectedIds = this.selectedIds.filter(
      (_item) => _item !== item.item_id
    );
  }

  onItemDeSelectAll(item: any) {
    console.log("onDeSelect", item);

    this.selectedIds = [];
  }

  onSelectAll(items: any) {
    console.log(items);

    this.selectedIds = items.map((item: any) => item.item_id);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  toggleVisibility() {
    this.loading = true;
    let formattedDate;

    if (this.data.data.type == "update") {
      formattedDate = this.data?.data.data.data.blockedDate.date;
    } else {
      formattedDate = moment(this.data.data.data).format("YYYY-MM-DD");
    }

    let data = {
      ids: this.selectedIds,
      date: formattedDate,
    };

    console.log("data", data);

    this.httpService.postData(baseUrl.blockDate, data).subscribe(
      (data: any) => {
        this.loading = false;
        this.dialog.closeAll();
        this.route.navigateByUrl("/host-reservations");
        this.snackBar.open(data.message, "x", {
          duration: 3000,
          panelClass: "success",
          horizontalPosition: "center",
          verticalPosition: "top",
        });

        console.log(data);
      },
      (err) => {
        this.loading = false;
        this.dialog.closeAll();
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
      }
    );
  }

  // getListing() {
  //   this.loading = true;
  //   this.httpService.getAuthSingle(baseUrl.listingSimple).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       if (data && data.data && data.data.length > 0) {
  //         this.dropdownList = data.data.map((item: any) => {
  //           return {
  //             item_id: item.id,
  //             item_text: item.title,
  //           };
  //         });

  //         if (
  //           this.data?.data?.data?.data?.listings &&
  //           this.data?.data?.data?.data?.listings.length > 0
  //         ) {
  //           this.selectedItems = this.data?.data?.data?.data?.listings.map(
  //             (listing: any) => {
  //               return {
  //                 item_id: listing.id,
  //                 item_text: listing.title,
  //               };
  //             }
  //           );

  //           this.selectedIds = this.data?.data?.data?.data?.listings.map(
  //             (listing: any) => listing.id
  //           );
  //         }
  //       } else {
  //         // Handle case where no data is returned or data structure is incorrect
  //         console.error("Invalid data format from server");
  //       }
  //     },
  //     (error) => {
  //       this.loading = false;
  //       console.error("Error fetching data:", error);
  //     }
  //   );
  // }

  getListing() {
    this.loading = true;
    this.httpService.getAuthSingle(baseUrl.listingSimple).subscribe(
      (response: any) => {
        this.loading = false;
        const data = response?.data;

        if (Array.isArray(data) && data.length > 0) {
          this.dropdownList = data.map((item: any) => ({
            item_id: item.id,
            item_text: item.title,
          }));

          const listings = this.data?.data?.data?.data?.listings;

          if (Array.isArray(listings) && listings.length > 0) {
            this.selectedItems = listings.map((listing: any) => ({
              item_id: listing.id,
              item_text: listing.title,
            }));

            this.selectedIds = listings.map((listing: any) => listing.id);
          }
        } else {
          console.error("Invalid data format from server");
        }
      },
      (error) => {
        this.loading = false;
        console.error("Error fetching data:", error);
      }
    );
  }
}
