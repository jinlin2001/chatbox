import React from 'react';

export interface LoginUser {
  name: string;
  _id: string;
}
export interface Guest extends LoginUser {
  online: boolean;
}
export interface Friends_Guests {
  friends: Guest[];
  guests: Guest[];
}
export interface Message {
  user_name: string;
  message: string;
  is_self: boolean;
}
export interface MessageList {
  messages: Message[];
}
export interface ChatRequest {
  host_id: string;
  host_name: string;
  room_id: string;
  room_title: string;
}
export interface ChatRequest_Time {
  request: ChatRequest;
  time: string;
}
export interface Obj_String {
  [k: string]: string;
}
export interface Obj_Boolean {
  [k: string]: boolean;
}
export interface Obj_ChatRequest_Time {
  [k: string]: ChatRequest_Time;
}
export interface Obj_ChatRequest {
  [k: string]: ChatRequest;
}
export interface Ref_NewRoom {
  newRoom: (room: ChatRequest) => void;
}
export interface Ref_ClearSearch {
  clearSearch: () => void;
}
export interface Props_CheckBox {
  id: string;
  friend: Guest;
  joined: boolean;
  invited: boolean;
}
export interface Props_Nav extends Ref_NewRoom {
  login_user: LoginUser;
  addFriend: (
    from: Guest[],
    guest_id: string,
    i: number,
    fromSearch?: boolean
  ) => Promise<void>;
  setLoginUser: React.Dispatch<React.SetStateAction<LoginUser | null>>;
  setFriendsGuests: React.Dispatch<React.SetStateAction<Friends_Guests | null>>;
}
export interface Props_Guests {
  friends_guests: Friends_Guests | null;
  addFriendHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export interface Props_Friends {
  friends_guests: Friends_Guests | null;
  reloadFriends: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
export interface Props_InMessage {
  user_name: string;
  message: string;
}
export interface Props_OutMessage {
  message: string;
}
export interface Props_SearchBar {
  login_user: LoginUser;
  addFriend: (
    from: Guest[],
    guest_id: string,
    i: number,
    fromSearch?: boolean
  ) => Promise<void>;
}
export interface Props_ProfileDropStart {
  login_user: LoginUser;
  setLoginUser: React.Dispatch<React.SetStateAction<LoginUser | null>>;
}
export interface Props_InvitationDropStart {
  login_user: LoginUser;
  newRoom: (request: ChatRequest) => void;
}
export interface Props_RoomsContainer {
  login_user: LoginUser;
  friends_online?: Guest[];
}
export interface Props_Room extends Props_RoomsContainer {
  host_id: string;
  room_id: string;
  room_title: string;
  active_tab: React.MutableRefObject<string | null>;
}
export interface Props_InviteForm {
  friends_online?: Guest[];
  joined: Obj_String;
  room_id: string;
  room_title: string;
  login_user: LoginUser;
}
export interface Props_NavPlaceholder {
  setLoginUser: (value: React.SetStateAction<LoginUser | null>) => void;
}
export interface Props_DataList {
  addFriendHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  datalist?: Guest[];
  component_type: string;
}
export interface signInSuccess {
  (authResult: any): boolean;
}
export interface uiShown_unsubscribe {
  (): void;
}
