import React from 'react';

import { Props_Friends } from '../../types';
import DataList from '../DataList';
function FriendsCanvas({ reloadFriends, friends_guests }: Props_Friends) {
  return (
    <div
      className='offcanvas offcanvas-end d-md-none text-center bg-fire'
      tabIndex={-1}
      id='friends-offcanvas'>
      <div className='offcanvas-header'>
        <span className='flex-fill'>Friends List</span>
        <button
          className='btn btn-outline-primary p-1 me-2'
          onClick={reloadFriends}>
          <img
            className='img-fluid float-start'
            src='arrow-clockwise.svg'
            alt='reload friends'
          />
        </button>
        <button className='btn-close btn-close-white' data-bs-dismiss='offcanvas'></button>
      </div>
      <div className='offcanvas-body overflow-auto'>
        <DataList
          datalist={friends_guests?.friends}
          component_type='friends-canvas'
        />
      </div>
    </div>
  );
}
export default FriendsCanvas;
