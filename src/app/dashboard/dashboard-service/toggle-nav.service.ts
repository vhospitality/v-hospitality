import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToggleNavService {
  message: string | undefined;
  propertyMessage: string | undefined;
  profileMessage: string | undefined;
  accommodationMessage: string | undefined;
  draft: string | undefined;
  collection: string | undefined;
  amenities: string | undefined;
  houseRules: string | undefined;
  wishlist: string | undefined;
  bankList: string | undefined;
  apartments: string | undefined;
  subscriptions: string | undefined;
  payoutMessage: string | undefined;
  faqs: string | undefined;
  cards: string | undefined;
  listingDetails: string | undefined;
  notificationMessage: string | undefined;
  private subject = new Subject<any>();
  private subjectHeader = new Subject<any>();
  private subjectToast = new Subject<any>();
  private subjectSignup = new Subject<any>();
  private paymentForm = new Subject<any>();
  private property = new Subject<any>();
  private submitProperty = new Subject<any>();
  private isLogin = new Subject<any>();
  private reloadSubscription = new Subject<any>();
  private notification = new Subject<any>();
  private foundListing = new Subject<any>();
  private headerNotificationSubscription = new Subject<any>();
  private roomSource = new BehaviorSubject(undefined);
  currentRoom = this.roomSource.asObservable();

  changeRoom(message: any) {
    this.roomSource.next(message);
  }

  setMessage(data: any) {
    this.message = data;
  }

  getMessage() {
    return this.message;
  }

  // save profile details
  setProfileMessage(data: any) {
    this.profileMessage = data;
  }

  getProfileMessage() {
    return this.profileMessage;
  }

  // save notification details
  setNotificationMessage(data: any) {
    this.notificationMessage = data;
  }

  getNotificationMessage() {
    return this.notificationMessage;
  }

  // save collection details
  setCollectionMessage(data: any) {
    this.collection = data;
  }

  getCollectionMessage() {
    return this.collection;
  }

  // save draft data
  setDraftMessage(data: any) {
    this.draft = data;
  }

  getDraftMessage() {
    return this.draft;
  }

  // save property data
  setPropertyMessage(data: any) {
    this.propertyMessage = data;
  }

  getPropertyMessage() {
    return this.propertyMessage;
  }

  // save user payout
  setPayoutMessage(data: any) {
    this.payoutMessage = data;
  }

  getPayoutMessage() {
    return this.payoutMessage;
  }

  // save accommodation data
  setAccommodationMessage(data: any) {
    this.accommodationMessage = data;
  }

  getAccommodationMessage() {
    return this.accommodationMessage;
  }

  // save amenities
  setAmenitiestMessage(data: any) {
    this.amenities = data;
  }

  getAmenitiesMessage() {
    return this.amenities;
  }

  // save house rules
  setHouseRulesMessage(data: any) {
    this.houseRules = data;
  }

  getHouseRulesMessage() {
    return this.houseRules;
  }

  // save wishlist
  setWishlistMessage(data: any) {
    this.wishlist = data;
  }

  getWishlistMessage() {
    return this.wishlist;
  }

  // save list of banks
  setBankListMessage(data: any) {
    this.bankList = data;
  }

  getBankListMessage() {
    return this.bankList;
  }

  // save subscriptions
  setSubscriptionsMessage(data: any) {
    this.subscriptions = data;
  }

  getSubscriptionsMessage() {
    return this.subscriptions;
  }

  // save apartments
  setApartmentMessage(data: any) {
    this.apartments = data;
  }

  getApartmentMessage() {
    return this.apartments;
  }

  // save faqs
  setFaqsMessage(data: any) {
    this.faqs = data;
  }

  getFaqsMessage() {
    return this.faqs;
  }

  // save cards
  setCardsMessage(data: any) {
    this.cards = data;
  }

  getCardsMessage() {
    return this.cards;
  }

  // saved listing for chat
  setListingDetailsMessage(data: any) {
    this.listingDetails = data;
  }

  getListingDetailsMessage() {
    return this.listingDetails;
  }

  // toggle side nav click event
  sendHeaderClickEvent() {
    this.subjectHeader.next(null);
  }

  getHeaderClickEvent(): Observable<any> {
    return this.subjectHeader.asObservable();
  }

  sendClickEvent(data: any) {
    this.subject.next(data);
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  // send toast click event
  sendToastClickEvent(data: any) {
    this.subjectToast.next(data);
  }

  getToastClickEvent(): Observable<any> {
    return this.subjectToast.asObservable();
  }

  // send signup click event for next form to display
  sendSignupClickEvent(data: any) {
    this.subjectSignup.next(data);
  }

  getSignupClickEvent(): Observable<any> {
    return this.subjectSignup.asObservable();
  }

  sendPaymentFormClickEvent(data: any) {
    this.paymentForm.next(data);
  }

  getPaymentFormClickEvent(): Observable<any> {
    return this.paymentForm.asObservable();
  }

  sendPropertyClickEvent(data: any) {
    this.property.next(data);
  }

  getPropertyClickEvent(): Observable<any> {
    return this.property.asObservable();
  }

  sendSubmitPropertyClickEvent(data: any) {
    this.submitProperty.next(data);
  }

  getNotificationClickEvent(): Observable<any> {
    return this.notification.asObservable();
  }

  sendNotificationClickEvent(data: any) {
    this.notification.next(data);
  }

  getSubmitPropertyClickEvent(): Observable<any> {
    return this.submitProperty.asObservable();
  }

  // send login click event to check if user is logged in
  sendIsLoginClickEvent() {
    this.isLogin.next(null);
  }

  getIsLoginClickEvent(): Observable<any> {
    return this.isLogin.asObservable();
  }

  sendFoundListingClickEvent(data: any) {
    this.foundListing.next(data);
  }

  getIsFoundListingClickEvent(): Observable<any> {
    return this.foundListing.asObservable();
  }

  // send event to reload subscriptions
  sendReloadSubscriptionClickEvent() {
    this.reloadSubscription.next(null);
  }

  getReloadSubscriptionClickEvent(): Observable<any> {
    return this.reloadSubscription.asObservable();
  }

  // send event to get notification when logged in
  sendNotificatonHeaderClickEvent() {
    this.headerNotificationSubscription.next(null);
  }

  getNotificatonHeaderClickEvent(): Observable<any> {
    return this.headerNotificationSubscription.asObservable();
  }
}
