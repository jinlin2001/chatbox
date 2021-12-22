import React from 'react';

import { CSS_OFFLINE, CSS_ONLINE, TXT_OFFLINE, TXT_ONLINE } from '../api';
import { Props_DataList } from '../types';

function DataList({
  datalist,
  addFriendHandler,
  component_type,
}: Props_DataList) {
  return (
    <ul className='list-group list-group-flush h-100'>
      {datalist?.map((user, i) => {
        return (
          <li
            key={`${component_type}-${user._id}`}
            title={user.name}
            className='list-group-item d-flex flex-nowrap align-items-center position-relative bg-transparent border-white text-white'>
            <small className='text-truncate text-capitalize flex-fill'>
              {user.name}
            </small>
            <small className={user.online ? CSS_ONLINE : CSS_OFFLINE}>
              {user.online ? TXT_ONLINE : TXT_OFFLINE}
            </small>
            {addFriendHandler ? (
              <button
                className='btn btn-outline-primary text-white fw-bold'
                onClick={addFriendHandler}
                data-guest_id={user._id}
                data-index={i}
                style={{ fontSize: '0.7rem' }}>
                +Friend
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
export default DataList;
