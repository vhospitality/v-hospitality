import { CommonModule, DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, DateSelectArg } from "@fullcalendar/core"; // useful for typechecking
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { ProgressBarModule } from "primeng/progressbar";
import { TableModule } from "primeng/table";
import { baseUrl } from "../../../../environments/environment";
import { AuthService } from "../../../global-services/auth.service";
import { ExcelService } from "../../../global-services/excel.service";
import { HttpService } from "../../../global-services/http.service";
import { BackButtonComponent } from "../../components/back-button/back-button.component";
import { DialogComponent } from "../../components/dialog/dialog.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { NoDataMessageComponent } from "../../components/no-data-message/no-data-message.component";
@Component({
  selector: "app-host-reservations",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    CalendarModule,
    MatButtonModule,
    TableModule,
    MatMenuModule,
    RouterModule,
    FullCalendarModule,
    ProgressBarModule,
    AvatarModule,
    AvatarGroupModule,
    BackButtonComponent,
    NoDataMessageComponent,
  ],
  providers: [ExcelService],
  templateUrl: "./host-reservations.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./host-reservations.component.scss"],
})
export class HostReservationsComponent implements AfterViewInit {
  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private authService: AuthService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
    this.paginateLoadData();
    this.loadCalendarData();
  }
  @ViewChild("fform") feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  reservations: any[] = [];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  total = 0;
  perPage = 15;
  filterObject: any = {};
  filterObject2: any = {};
  paymentStatus: any = [
    { viewValue: "Pending", value: "pending" },
    { viewValue: "Failed", value: "failed" },
    { viewValue: "success", value: "success" },
  ];
  bookingStatus: any = [
    { viewValue: "Pending", value: "pending" },
    { viewValue: "Declined", value: "declined" },
    { viewValue: "Accepted", value: "accepted" },
    { viewValue: "Checked in", value: "check_in" },
    { viewValue: "Checked out", value: "checked_out" },
  ];
  updatingUUID: any[] = [];
  active: string = "add";
  loadingCalender: boolean = false;
  calenderValue: number = 0;
  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    initialDate: new Date(),
    headerToolbar: {
      left: "",
      center: "title",
      right: "today prev,next",
    },
    plugins: [dayGridPlugin],
  };

  calenderEvents: any;
  pageEvent: any;

  ngOnInit() {
    const activeTab = this.route.snapshot.queryParamMap.get("active");

    this.router.events.subscribe(() => {
      this.active = this.route.snapshot.queryParamMap.get("active")
        ? "calender"
        : "add";
    });

    // console.log("tab tab", activeTab);

    // if (activeTab) {
    //   this.active = activeTab;
    // }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      search: [""],
      date: [""],
      payment_status: [""],
      booking_status: [""],
      booking_code: [""],
    });
  }

  paginateLoadData(event?: any) {
    this.loading = true;
    this.reservations = [];
    this.filterObject = {};
    const get_current_page = event?.first + this.perPage || this.perPage;
    this.pageEvent = event;

    if (this.feedbackForm.value.search) {
      Object.assign(this.filterObject, {
        "filter[listing]": this.feedbackForm.value.search,
      });
    }

    if (this.feedbackForm.value.booking_status) {
      Object.assign(this.filterObject, {
        "filter[status]": this.feedbackForm.value.booking_status,
      });
    }

    if (this.feedbackForm.value.payment_status) {
      Object.assign(this.filterObject, {
        "filter[payment_status]": this.feedbackForm.value.payment_status,
      });
    }

    if (this.feedbackForm.value.date) {
      Object.assign(this.filterObject, {
        "filter[created_at]": this.datepipe.transform(
          this.feedbackForm.value.date,
          "YYYY-MM-dd"
        ),
      });
    }

    if (this.feedbackForm.value.booking_code) {
      Object.assign(this.filterObject, {
        "filter[booking_code]": this.feedbackForm.value.booking_code,
      });
    }

    let url = new URLSearchParams(this.filterObject).toString();

    this.httpService
      .getAuthSingle(
        baseUrl.reservations +
          `/?per_page=${
            this.perPage
          }&include=listing,user&fields[user]=first_name,last_name&fields[bookings]=uuid,booking_code,check_in,check_out,status,payment_status,guests,created_at&fields[listing]=is_instant_bookable,uuid,price_per_night,cleaning_fee,occupancy_taxes,title&page=${
            get_current_page / this.perPage
          }&${url}`
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.reservations = data?.data?.data;
          this.total = data?.data?.total;
        },
        () => {
          this.authService.checkExpired();
          this.loading = false;
          this.total = 0;
          this.reservations = [];
        }
      );
  }

  // remove reservation from loading
  removeReservation(uuid: string) {
    let index = this.updatingUUID.indexOf(uuid);

    if (index !== -1) {
      this.updatingUUID.splice(index, 1);
    }
  }

  updateReservation(uuid: string, status: string) {
    this.updatingUUID.push(uuid);

    this.httpService
      .updateData(baseUrl.reservations + `/${uuid}`, {
        status: status,
      })
      .subscribe(
        (data: any) => {
          this.removeReservation(uuid);
          this.snackBar.open("Successfully updated reservation", "x", {
            duration: 3000,
            panelClass: "success",
            horizontalPosition: "center",
            verticalPosition: "top",
          });
          this.paginateLoadData();
        },
        (err) => {
          this.removeReservation(uuid);
          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              "An error occured!",
            "x",
            {
              duration: 3000,
              panelClass: "error",
              horizontalPosition: "center",
              verticalPosition: "top",
            }
          );
        }
      );
  }

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type || "dialog",
        data: data,
      },
    });

    // after dialog close
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.loading) {
        this.paginateLoadData(this.pageEvent);
      }
    });
  }

  exportCSV(): void {
    let data: any = [];

    for (let n of this.reservations)
      data.push({
        Guest: `${n?.user?.first_name} ${n?.user?.last_name}`,
        "Number of Guest": `${n?.guests?.adults} Adult, ${
          n?.guests?.children
        } Children, ${n?.guests?.infants} Infant Total: (${
          n?.guests?.adults + n?.guests?.children + n?.guests?.infants
        })`,
        Listing: n?.listing?.title,
        Dates: `Check in ${n?.check_in}, Check out, ${n?.check_out}`,
        "Reservation Status": n?.status,
        "Payment Status": n?.payment_status,
        "Reservation Code": n?.booking_code,
        Booked: n?.created_at,
        Earnings: n?.amount_paid || n?.amount || n?.initial_amount,
      });
    this.excelService.exportAsExcelFile(data, "RESERVATIONS");
  }

  getNumberOfNight(checkinDate: string, checkoutDate: string) {
    const date1: any = new Date(checkinDate);
    const date2: any = new Date(checkoutDate);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    const diffTime1 = Math.abs(date2 - date1);
    const diffDays1 = Math.floor(diffTime1 / (1000 * 60 * 60 * 24));
    return diffDays1 < 1 ? 1 : diffDays1;
  }

  getTotalGuest(reservation: any) {
    return (
      Number(reservation?.infants) +
      Number(reservation?.children) +
      Number(reservation?.adults)
    );
  }

  getServiceChargeAmount(data: any) {
    const tax = 6 / 100;
    const serviceCharge =
      data?.listing?.price_per_night *
      this.getNumberOfNight(data?.check_in, data?.check_out);
    return serviceCharge * tax;
  }

  getTotal(data: any) {
    return data?.listing?.price_per_night + data?.listing?.cleaning_fee;
  }

  clearFilter() {
    this.feedbackFormDirective.resetForm();
    this.paginateLoadData();
    this.loadCalendarData();
  }

  displayDecline(data: any) {
    const date1: any = new Date(data?.check_in);
    const date2: any = new Date();
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(date2 - date1);
    // Convert milliseconds to hours
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    if (Number(differenceInHours) >= 24) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit() {
    this.authService.checkExpired();
  }

  loadCalendarData() {
    this.loadingCalender = true;
    this.calendarOptions = {
      initialView: "dayGridMonth",
      initialDate: new Date(),
      headerToolbar: {
        left: "",
        center: "title",
        right: "today prev,next",
      },
      plugins: [dayGridPlugin],
    };
    this.filterObject2 = {};

    if (this.feedbackForm.value.search) {
      Object.assign(this.filterObject2, {
        "filter[guest_name]": this.feedbackForm.value.search,
      });
    }

    if (this.feedbackForm.value.booking_status) {
      Object.assign(this.filterObject2, {
        "filter[status]": this.feedbackForm.value.booking_status,
      });
    }

    if (this.feedbackForm.value.date) {
      Object.assign(this.filterObject2, {
        "filter[created_at]": this.datepipe.transform(
          this.feedbackForm.value.date,
          "YYYY-MM-dd"
        ),
      });
    }

    let url = new URLSearchParams(this.filterObject2).toString();

    // this.httpService.getProgress("calendars" + `/?${url}`).subscribe(
    //   (progress: any) => {
    //     if (typeof progress !== "number" && typeof progress !== "undefined") {
    //       let events = [];

    //       for (let e of progress?.data) {
    //         events.push({
    //           title: e?.guest_name,
    //           start: e?.check_in,
    //           end: e?.check_out,
    //           status: e?.status,
    //           check_in: e?.check_in,
    //           check_out: e?.check_out,
    //           data: e,
    //         });
    //       }

    //       this.calenderEvents = events;

    //       this.calendarOptions = {
    //         initialView: "dayGridMonth",
    //         height: "auto",
    //         initialDate: new Date(),
    //         eventClick: this.handleEventClick.bind(this),
    //         events: events,
    //         select: this.handleDateSelect.bind(this),
    //         dateClick: (arg) => this.handleDateClick(arg),
    //         headerToolbar: {
    //           left: "dayGridMonth,dayGridWeek,dayGridDay",
    //           center: "title",
    //           right: "today prev,next",
    //         },
    //         plugins: [dayGridPlugin, interactionPlugin],
    //       };
    //       this.loadingCalender = false;
    //     } else {
    //       if (typeof progress === "number" && progress >= 95) {
    //         this.calenderValue = 95;
    //       } else {
    //         this.calenderValue = progress || 0;
    //       }
    //     }
    //   },
    //   (err) => {
    //     this.authService.checkExpired();
    //     this.loadingCalender = false;
    //     this.calenderValue = 0;
    //     this.calenderEvents = undefined;
    //     this.calendarOptions = {
    //       initialView: "dayGridMonth",
    //       initialDate: new Date(),
    //       headerToolbar: {
    //         left: "",
    //         center: "title",
    //         right: "today prev,next",
    //       },
    //       plugins: [dayGridPlugin],
    //     };
    //   }
    // );

    this.httpService.getProgress("calendars" + `/?${url}`).subscribe(
      (progress: any) => {
        if (typeof progress !== "number" && typeof progress !== "undefined") {
          let events: any[] = [];

          for (let e of progress?.data) {
            events.push({
              title: e?.guest_name,
              start: e?.check_in,
              end: e?.check_out,
              status: e?.status,
              check_in: e?.check_in,
              check_out: e?.check_out,
              data: e,
            });
          }

          // Make another HTTP request to get the blocked dates
          this.httpService.getProgress("hosts/calendars/blocked").subscribe(
            (blockedDates: any) => {
              console.log(blockedDates);

              for (let b of blockedDates?.data) {
                events.push({
                  title: "Blocked",
                  start: b?.blockedDate.date,
                  end: b?.blockedDate.date,
                  type: "blocked",
                  data: b,
                });
              }

              this.calenderEvents = events;

              this.calendarOptions = {
                initialView: "dayGridMonth",
                height: "auto",
                initialDate: new Date(),
                eventClick: this.handleEventClick.bind(this),
                events: events,
                select: this.handleDateSelect.bind(this),
                dateClick: (arg) => this.handleDateClick(arg),
                headerToolbar: {
                  left: "dayGridMonth,dayGridWeek,dayGridDay",
                  center: "title",
                  right: "today prev,next",
                },
                plugins: [dayGridPlugin, interactionPlugin],
              };
              this.loadingCalender = false;
            },
            (err) => {
              console.error("Failed to load blocked dates", err);
            }
          );
        } else {
          if (typeof progress === "number" && progress >= 95) {
            this.calenderValue = 95;
          } else {
            this.calenderValue = progress || 0;
          }
        }
      },
      (err) => {
        this.authService.checkExpired();
        this.loadingCalender = false;
        this.calenderValue = 0;
        this.calenderEvents = undefined;
        this.calendarOptions = {
          initialView: "dayGridMonth",
          initialDate: new Date(),
          headerToolbar: {
            left: "",
            center: "title",
            right: "today prev,next",
          },
          plugins: [dayGridPlugin],
        };
      }
    );
  }

  handleEventClick(arg: any): void {
    console.log("event", arg?.event?._def);

    if (arg?.event?._def?.extendedProps?.type == "blocked") {
      this.openDialog(
        {
          requestType: "date-block",
          requestMessage: "Update Blocked Date",
          data: {
            type: "update",
            data: arg?.event?._def?.extendedProps,
          },
        },
        "dialog"
      );
    } else {
      this.openDialog(
        {
          requestType: "guest-details",
          requestMessage: "Guest Details",
          data: arg?.event?._def,
        },
        "dialog"
      );
    }
  }

  // Custom function to handle date selection
  handleDateSelect(selectInfo: DateSelectArg) {
    const selectedDate = selectInfo.start;

    console.log(selectInfo);

    // // Check if the selected date is disabled
    // if (this.isDateDisabled(selectedDate)) {
    //   // Prevent selection of disabled dates
    //   this.calendarOptions.selectable = false;
    //   alert("This date is disabled.");
    // } else {
    //   // Allow selection of valid dates
    //   this.calendarOptions.selectable = true;
    //   // Handle the selected date as needed
    //   alert("Selected date: " + selectedDate);
    // }
  }

  handleDateClick(arg: DateClickArg) {
    const selectedDate = arg.date;

    console.log(arg);

    // // Check if the selected date is disabled
    if (this.isDateDisabled(selectedDate)) {
      // Prevent selection of disabled dates
      this.calendarOptions.selectable = false;
      alert("This date is disabled.");
    } else {
      // Allow selection of valid dates
      this.calendarOptions.selectable = true;
      // Handle the selected date as needed
      // alert("Selected date: " + selectedDate);
      this.openDialog(
        {
          requestType: "date-block",
          requestMessage: "Toggle Data Visibility",
          data: {
            type: "create",
            data: selectedDate,
          },
        },
        "dialog"
      );
    }
  }

  // Custom function to check if a date is disabled
  isDateDisabled(date: Date): boolean {
    // Implement your logic to determine if the date is disabled
    // For example, you might have an array of disabled dates
    const disabledDates: any = [
      /* list of disabled dates as Date objects */
      new Date("2023-12-18"),
      new Date("2023-12-19"),
    ];
    return disabledDates.some(
      (disabledDate: any) => disabledDate.getTime() === date.getTime()
    );
  }

  removeDate() {
    this.feedbackForm.get("date").setValue(null);
  }

  splitBookingStatus(status: string) {
    let splitText = status.split("_");
    if (splitText.length > 1) {
      return splitText[0] + " " + splitText[1];
    } else {
      return status;
    }
  }

  goToCalendar() {
    this.router.navigateByUrl("host-reservations?active=calender");
  }

  goBack() {
    this.router.navigateByUrl("host-reservations");
  }
}
