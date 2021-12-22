import React, { forwardRef, useEffect } from 'react';

import { API_OPTIONS, API_GET_FRIENDS_GUESTS } from '../../api';
import { Props_Nav, Ref_ClearSearch } from '../../types';
import { hideSpinner, showSpinner } from '../../spinner';
import { showToast } from '../../toast';
import InvitationDropStart from './InvitationDropStart';
import ProfileDropStart from './ProfileDropStart';
import SearchBar from './SearchBar';

const NavBar = forwardRef<Ref_ClearSearch, Props_Nav>(
  ({ login_user, setLoginUser, setFriendsGuests, addFriend, newRoom }, ref) => {
    useEffect(() => {
      (async () => {
        try {
          showSpinner();
          const api_response = await fetch(API_GET_FRIENDS_GUESTS, {
            ...API_OPTIONS,
            body: JSON.stringify({ _id: login_user._id }),
          });
          if (!api_response.ok) {
            throw new Error('Failed fetching user data.');
          }
          const json_friends_guests = await api_response.json();
          setFriendsGuests(json_friends_guests);
          hideSpinner();
        } catch (error: any) {
          hideSpinner();
          showToast(error.message);
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        className='card-header d-flex align-items-center border-0 bg-transparent'
        style={{ zIndex: 10 }}>
        <button
          className='btn btn-outline-primary d-lg-none flex-shrink-0 px-0 py-2 me-2'
          data-bs-toggle='offcanvas'
          data-bs-target='#guests-offcanvas'>
          <img
            className='img-fluid float-start'
            src='arrow-bar-right.svg'
            alt='open guests offcanvas'
          />
        </button>
        <span className='d-none d-lg-inline fs-3 me-3'>
          ChatBox
        </span>
        <SearchBar ref={ref} login_user={login_user} addFriend={addFriend} />
        <InvitationDropStart login_user={login_user} newRoom={newRoom} />
        <ProfileDropStart login_user={login_user} setLoginUser={setLoginUser} />
        <button
          className='btn btn-outline-primary d-md-none flex-shrink-0 px-0 py-2 ms-2'
          data-bs-toggle='offcanvas'
          data-bs-target='#friends-offcanvas'>
          <img
            className='img-fluid float-start'
            src='arrow-bar-left.svg'
            alt='open friends offcanvas'
          />
        </button>
      </div>
    );
  }
);
export default NavBar;
