import React from 'react';

import { Props_Friends } from '../../types';
import DataList from '../DataList';

function Friends({ reloadFriends, friends_guests }: Props_Friends) {
  return (
    <div className='d-none d-md-block col-md-4 col-lg-3 h-100'>
      <div className='card h-100 text-center border-0 rounded-0 border-start bg-transparent'>
        <div className='card-header d-flex p-0 border-0'>
          <span className='flex-fill'>Friends List</span>
          <button
            className='btn btn-outline-primary p-1 me-1'
            onClick={reloadFriends}>
            <img
              className='img-fluid float-start'
              src='arrow-clockwise.svg'
              alt='reload friends'
            />
          </button>
        </div>
        <div className='card-body overflow-auto'>
          <DataList
            datalist={friends_guests?.friends}
            component_type='friends'
          />
        </div>
      </div>
    </div>
  );
}
export default Friends;
