import React from 'react';

import { Props_Guests } from '../../types';
import DataList from '../DataList';

function GuestsCanvas({ addFriendHandler, friends_guests }: Props_Guests) {
  return (
    <div
      className='offcanvas offcanvas-start d-lg-none text-center bg-fire'
      tabIndex={-1}
      id='guests-offcanvas'>
      <div className='offcanvas-header'>
        <span className='flex-fill'>Guests List</span>
        <button className='btn-close btn-close-white' data-bs-dismiss='offcanvas'></button>
      </div>
      <div className='offcanvas-body overflow-auto'>
        <DataList
          datalist={friends_guests?.guests}
          addFriendHandler={addFriendHandler}
          component_type='guests-canvas'
        />
      </div>
    </div>
  );
}
export default GuestsCanvas;
