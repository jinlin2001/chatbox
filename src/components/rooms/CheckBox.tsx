import React from 'react';

import { Props_CheckBox } from '../../types';

function CheckBox({ id, friend, invited, joined }: Props_CheckBox) {
  return (
    <div
      className='form-check form-switch w-100'
      title={friend.name}>
      <input
        id={id}
        type='checkbox'
        className='form-check-input'
        value={friend._id}
        disabled={joined}
      />
      <label
        htmlFor={id}
        className='form-check-label d-flex align-items-center position-relative'>
        <small className='text-nowrap text-truncate text-capitalize flex-fill'>
          {friend.name}
        </small>
        <div className='position-absolute d-flex flex-nowrap top-0 end-0 translate-middle-y'>
          {invited ? (
            <small className='badge bg-warning rounded-0'>
              INVITED
            </small>
          ) : null}

          {joined ? (
            <small className='badge bg-success rounded-0'>
              JOINED
            </small>
          ) : null}
        </div>
      </label>
    </div>
  );
}
export default CheckBox;
