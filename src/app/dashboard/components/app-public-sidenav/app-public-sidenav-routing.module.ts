import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { AppPublicSidenavComponent } from "./app-public-sidenav.component";
import { IsLoggedInGuard } from "../../../guards/is-logged-in.guards";

const routes: Routes = [
  {
    path: "",
    component: AppPublicSidenavComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      {
        path: "home",
        loadComponent: () =>
          import(
            "../../pages/african-hospitality/african-hospitality.component"
          ).then((m) => m.AfricanHospitalityComponent),
      },
      {
        path: "home-two",
        loadComponent: () =>
          import(
            "../../pages/african-hospitality-two/african-hospitality-two.component"
          ).then((m) => m.AfricanHospitalityTwoComponent),
      },
      {
        path: "home/:id",
        loadComponent: () =>
          import(
            "../../pages/african-hospitality/african-hospitality.component"
          ).then((m) => m.AfricanHospitalityComponent),
      },
      {
        path: "faqs",
        loadComponent: () =>
          import("../../pages/faqs/faqs.component").then(
            (m) => m.FaqsComponent
          ),
      },
      {
        path: "wishlist",
        loadComponent: () =>
          import("../../pages/wishlist/wishlist.component").then(
            (m) => m.WishlistComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "accommodations",
        loadComponent: () =>
          import(
            "../../pages/accommodation-listing/accommodation-listing.component"
          ).then((m) => m.AccommodationListingComponent),
      },
      {
        path: "accommodations-details/:id",
        loadComponent: () =>
          import(
            "../../pages/accommodation-details/accommodation-details.component"
          ).then((m) => m.AccommodationDetailsComponent),
      },
      {
        path: "chat",
        loadComponent: () =>
          import("../../pages/chat/chat.component").then(
            (m) => m.ChatComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "verify-email",
        loadComponent: () =>
          import(
            "../../pages/email-verification/email-verification.component"
          ).then((m) => m.EmailVerificationComponent),
      },
      {
        path: "forget-password",
        loadComponent: () =>
          import("../../pages/forgot-password/forgot-password.component").then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: "booking",
        loadComponent: () =>
          import(
            "../../pages/accommodation-booking/accommodation-booking.component"
          ).then((m) => m.AccommodationBookingComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "account",
        loadComponent: () =>
          import("../../pages/account/account.component").then(
            (m) => m.AccountComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "account/:id",
        loadComponent: () =>
          import("../../pages/account/account.component").then(
            (m) => m.AccountComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "review/:id",
        loadComponent: () =>
          import("../../pages/review/review.component").then(
            (m) => m.ReviewComponent
          ),
      },
      {
        path: "host-listing",
        loadComponent: () =>
          import("../../pages/host-listing/host-listing.component").then(
            (m) => m.HostListingComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "host-reservations",
        loadComponent: () =>
          import(
            "../../pages/host-reservations/host-reservations.component"
          ).then((m) => m.HostReservationsComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "host-review/:id",
        loadComponent: () =>
          import(
            "../../pages/host-review-feedback/host-review-feedback.component"
          ).then((m) => m.HostReviewFeedbackComponent),
      },
      {
        path: "host-subscription",
        loadComponent: () =>
          import(
            "../../pages/host-list-property/host-list-property.component"
          ).then((m) => m.HostListPropertyComponent),
      },
      {
        path: "host-subscription/:id",
        loadComponent: () =>
          import(
            "../../pages/host-list-property/host-list-property.component"
          ).then((m) => m.HostListPropertyComponent),
      },
      {
        path: "host-performance",
        loadComponent: () =>
          import(
            "../../pages/host-performance/host-performance.component"
          ).then((m) => m.HostPerformanceComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "host-earnings",
        loadComponent: () =>
          import("../../pages/earnings/earnings.component").then(
            (m) => m.EarningsComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "property-summary",
        loadComponent: () =>
          import("../../pages/listing-summary/listing-summary.component").then(
            (m) => m.ListingSummaryComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "property-pending-approval",
        loadComponent: () =>
          import(
            "../../pages/listing-pending-page/listing-pending-page.component"
          ).then((m) => m.ListingPendingPageComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "property-signup",
        loadComponent: () =>
          import(
            "../../pages/property-registration-page/property-registration-page.component"
          ).then((m) => m.PropertyRegistrationPageComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "bookings",
        loadComponent: () =>
          import("../../pages/guest-booking/guest-booking.component").then(
            (m) => m.GuestBookingComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "booking-details",
        loadComponent: () =>
          import(
            "../../pages/view-booking-details/view-booking-details.component"
          ).then((m) => m.ViewBookingDetailsComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "notifications",
        loadComponent: () =>
          import(
            "../../pages/notification-history/notification-history.component"
          ).then((m) => m.NotificationHistoryComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "about",
        loadComponent: () =>
          import("../../pages/about-us/about-us.component").then(
            (m) => m.AboutUsComponent
          ),
      },
      {
        path: "check-out/:id",
        loadComponent: () =>
          import("../../pages/guest-check-out/guest-check-out.component").then(
            (m) => m.GuestCheckOutComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "listing-review/:id",
        loadComponent: () =>
          import("../../pages/listing-review/listing-review.component").then(
            (m) => m.ListingReviewComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "property-summary-preview",
        loadComponent: () =>
          import(
            "../../pages/listing-summary-preview/listing-summary-preview.component"
          ).then((m) => m.ListingSummaryPreviewComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "transaction-history",
        loadComponent: () =>
          import(
            "../../pages/transaction-history/transaction-history.component"
          ).then((m) => m.TransactionHistoryComponent),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "booking-preview/:id",
        loadComponent: () =>
          import("../../pages/booking-pending/booking-pending.component").then(
            (m) => m.BookingPendingComponent
          ),
        canLoad: [IsLoggedInGuard],
      },
      {
        path: "terms",
        loadComponent: () =>
          import("../../pages/terms/terms.component").then(
            (m) => m.TermsComponent
          ),
      },
      {
        path: "privacy-policy",
        loadComponent: () =>
          import("../../pages/privacy-policy/privacy-policy.component").then(
            (m) => m.PrivacyPolicyComponent
          ),
      },
      {
        path: "cookie-policy",
        loadComponent: () =>
          import("../../pages/cookie-policy/cookie-policy.component").then(
            (m) => m.CookiePolicyComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), LoadingBarRouterModule],
  exports: [RouterModule],
})
export class AppPublicSidenavRoutingModule {}
