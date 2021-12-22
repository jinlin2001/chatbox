import React from 'react';

import { Props_InMessage } from '../../types';

function InMessage({ user_name, message }: Props_InMessage) {
  return (
    <div className='d-flex flex-nowrap'>
      <span className='align-self-center position-relative p-3'>
        <img
          className='img-fluid float-start'
          src='person-circle.svg'
          alt='person icon'
        />
        <small className='position-absolute text-nowrap text-capitalize top-0 start-0 fw-bold text-center w-100 badge'>
          {user_name}
        </small>
      </span>
      <p
        className='text-break m-0 mt-3 p-2 in-message'
        style={{ maxWidth: '60%' }}>
        {message}
      </p>
    </div>
  );
}
export default InMessage;
