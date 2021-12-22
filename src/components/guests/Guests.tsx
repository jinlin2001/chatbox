import React from 'react';

import { Props_Guests } from '../../types';
import DataList from '../DataList';

function Guests({ addFriendHandler, friends_guests }: Props_Guests) {
  return (
    <div className='d-none d-lg-block col-lg-3 h-100'>
      <div className='card h-100 text-center rounded-0 border-0 border-end bg-transparent'>
        <div className='card-header p-0 border-0'>Guests List</div>
        <div className='card-body overflow-auto'>
          <DataList
            datalist={friends_guests?.guests}
            addFriendHandler={addFriendHandler}
            component_type='guests'
          />
        </div>
      </div>
    </div>
  );
}
export default Guests;
