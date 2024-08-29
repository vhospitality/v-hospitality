// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
};

export const baseUrl = {
  jwt_token: "VHOSPITALITY_ACCESS",
  refresh_token: "VHOSPITALITY_REFRESH",
  wishlist_storage: "VHOSPITALITY_WISHLIST",
  server: "https://api.v-hospitality.com/api/v1/",
  messagingUrl: "https://chat-api.v-hospitality.com/",
  messagingUrl2: "https://chat-api.v-hospitality.com",
  feDomain: "v-hospitality.com",
  feDomain2: "https://www.v-hospitality.com",
  login: "login",
  refresh: "user/api/v1/token/refresh/",
  requestResetPassword: "reset-passwords",
  signupRequestVerification: "verifications",
  signupVerifyOtp: "verifications/verify",
  register: "register",
  profileDetails: "auth",
  subscriptions: "subscriptions",
  free_subscription: "subscribe",
  faqs: "faqs",
  wishlist: "wishlists",
  listing: "listings",
  listingSimple: "hosts/listings/simple",
  blockDate: "hosts/listings/block/date",
  collection: "collections",
  passwordVerification: "reset-passwords/verifications",
  draft: "drafts",
  amenities: "amenities",
  amenityCategories: "amenity-categories",
  houseRules: "house-rules",
  hostListing: "hosts/listings",
  bookings: "bookings",
  bankList: "services/banks",
  bank: "banks",
  reservations: "reservations",
  earnings: "earnings",
  cards: "cards",
  newsletter: "newsletters",
  otp: "otp",
  withdraws: "withdraws",
  deviceToken: "auth/device-token",
  verification: "auth/identity-verifications",
  notifications: "notifications",
  advanceVerification: "auth/advance-verification-token",
  localStorageSelectedBooking: "SELECTED_BOOKING",
  localStorageSelectedChat: "SELECTED_CHAT",
  rooms: "VHOSPITALITY_ROOM",
  firebaseNotification: "https://fcm.googleapis.com/fcm/send",
  lazyLoadUrl: "https://v-hosiptality.fra1.digitaloceanspaces.com/",
  firebase: {
    apiKey: "AIzaSyDxAKcOaXLD5v9CFSB6d7CP2n6_3gmUIRE",
    authDomain: "v-hospitality-notification.firebaseapp.com",
    projectId: "v-hospitality-notification",
    storageBucket: "v-hospitality-notification.appspot.com",
    messagingSenderId: "854763270562",
    appId: "1:854763270562:web:eb2aaab47449a1dbbc02fb",
    measurementId: "G-33WWMH8CXR",
    vapidKey:
      "BHX5EEaflCthKhlv8y08uqbakwqfRCMginjRJOxYeT36KJi4zwxzJLA9-cY-3NOeBCIfcEq92gef7oj9EYghS1k",
  },
  defaultImage: "assets/images/listproperty-image2.jpeg",
  defaultProfileImage: "assets/icons/unnamed.png",
  paystackKey: "pk_live_eb36b00cba906840da2b6f96dddc760c4afb6eac",
  searchLocation:
    "https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyCE4z4wdxDikBjqjTsMPEK0p6Dd5faoqbg&query=",
    affiliateSignUp: "affiliate/register",
};
