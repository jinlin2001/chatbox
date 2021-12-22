import React from 'react';

import { Props_OutMessage } from '../../types';

function OutMessage({ message }: Props_OutMessage) {
  return (
    <div className='d-flex flex-nowrap justify-content-end'>
      <p
        className='text-break m-0 mt-3 p-2 out-message'
        style={{ maxWidth: '60%'}}>
        {message}
      </p>

      <span className='align-self-center position-relative p-3'>
        <img
          className='img-fluid float-start'
          src='person-circle.svg'
          alt='person icon'
        />
        <small className='position-absolute top-0 start-0 w-100 text-center fw-bold badge'>
          You
        </small>
      </span>
    </div>
  );
}
export default OutMessage;
