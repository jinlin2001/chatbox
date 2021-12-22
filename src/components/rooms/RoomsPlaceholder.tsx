import React from 'react';

function RoomsPlaceholder() {
  return (
    <div className='col-12 col-md-8 col-lg-6 h-100'>
      <div className='card h-100 w-100 bg-transparent border-0 rounded-0'>
        <div className='card-body row rol-cols-1 g-0 placeholder-wave overflow-auto'>
          <span className='placeholder col-7 mb-1'></span>
          <span className='placeholder col-7 mb-1'></span>
          <span className='placeholder col-7 offset-5 mb-1'></span>
          <span className='placeholder col-7 offset-5 mb-1'></span>
        </div>
        <div className='card-footer p-0 border-0 rounded-0'>
          <div className='row placeholder-wave gx-0'>
            <span className='p-3 placeholder col-11'></span>
            <span className='col-1 text-center align-self-center'>
              <img src='caret-right.svg' alt='send button' />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RoomsPlaceholder;
