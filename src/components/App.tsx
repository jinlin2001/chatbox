import React, { useRef, useState } from 'react';

import { API_ADD_FRIEND, API_GET_FRIENDS, API_OPTIONS } from '../api';
import {
  ChatRequest,
  Friends_Guests,
  LoginUser,
  Ref_NewRoom,
  Ref_ClearSearch,
  Guest,
} from '../types';
import { hideSpinner, showSpinner } from '../spinner';
import { showToast } from '../toast';
import FriendPlaceholder from './friends/FriendPlaceholder';
import Friends from './friends/Friends';
import FriendsCanvas from './friends/FriendsCanvas';
import GuestPlaceholder from './guests/GuestPlaceholder';
import Guests from './guests/Guests';
import GuestsCanvas from './guests/GuestsCanvas';
import NavBar from './navbar/NavBar';
import NavPlaceholder from './navbar/NavPlaceholder';
import RoomContainer from './rooms/RoomContainer';
import RoomsPlaceholder from './rooms/RoomsPlaceholder';

function App() {
  const [login_user, setLoginUser] = useState<LoginUser | null>(null);
  const [friends_guests, setFriendsGuests] = useState<Friends_Guests | null>(
    null
  );
  const room_container = useRef<Ref_NewRoom>(null);
  const navbar = useRef<Ref_ClearSearch>(null);
  const friends_online = friends_guests?.friends.filter(
    (friends) => friends.online
  );

  const newRoom = (request: ChatRequest) => {
    room_container.current?.newRoom(request);
  };

  const clearSearch = () => {
    navbar.current?.clearSearch();
  };

  const addFriend = async (
    from: Guest[],
    guest_id: string,
    from_index: number,
    from_search: boolean = false
  ) => {
    try {
      const { ok } = await fetch(API_ADD_FRIEND, {
        ...API_OPTIONS,
        body: JSON.stringify({
          user_id: login_user!._id,
          friend_id: guest_id,
        }),
      });
      if (!ok) {
        throw new Error('Failed adding friend.');
      }
      friends_guests!.friends.push(from.splice(from_index, 1)[0]);
      if (from_search) {
        const index = friends_guests!.guests.findIndex(
          (g) => g._id === guest_id
        );
        if (index >= 0) {
          friends_guests!.guests.splice(index, 1);
        }
      }
      setFriendsGuests({ ...friends_guests! });
      hideSpinner();
      showToast('Friend added successfully.');
    } catch (error: any) {
      hideSpinner();
      showToast(error.message);
    }
  };
  const addFriendHandler = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    showSpinner();
    event.stopPropagation();
    const { guest_id, index } = event.currentTarget.dataset;
    await addFriend(friends_guests!.guests, guest_id!, +index!);
  };

  const reloadFriends = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      showSpinner();
      event.stopPropagation();
      const api_response = await fetch(API_GET_FRIENDS, {
        ...API_OPTIONS,
        body: JSON.stringify({
          _id: login_user!._id,
        }),
      });
      if (!api_response.ok) {
        throw new Error('Failed fetching friends.');
      }
      const friends = await api_response.json();
      setFriendsGuests({ ...friends_guests!, friends });
      hideSpinner();
    } catch (error: any) {
      hideSpinner();
      showToast(error.message);
    }
  };

  return (
    <>
      <div
        className='card vh-100 border-0 rounded-0 bg-transparent'
        onClick={clearSearch}>
        {login_user ? (
          <NavBar
            login_user={login_user}
            addFriend={addFriend}
            newRoom={newRoom}
            setFriendsGuests={setFriendsGuests}
            setLoginUser={setLoginUser}
            ref={navbar}
          />
        ) : (
          <NavPlaceholder setLoginUser={setLoginUser} />
        )}

        <div className='card-body p-0 row g-0 overflow-auto'>
          {login_user ? (
            <>
              <Guests
                addFriendHandler={addFriendHandler}
                friends_guests={friends_guests}
              />
              <RoomContainer
                login_user={login_user}
                friends_online={friends_online}
                ref={room_container}
              />
              <Friends
                reloadFriends={reloadFriends}
                friends_guests={friends_guests}
              />
            </>
          ) : (
            <>
              <GuestPlaceholder />
              <RoomsPlaceholder />
              <FriendPlaceholder />
            </>
          )}
        </div>
      </div>

      {login_user ? (
        <>
          <GuestsCanvas
            addFriendHandler={addFriendHandler}
            friends_guests={friends_guests}
          />
          <FriendsCanvas
            reloadFriends={reloadFriends}
            friends_guests={friends_guests}
          />
        </>
      ) : null}
    </>
  );
}
export default App;
