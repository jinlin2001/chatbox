import React from 'react';

function BasePlaceholder() {
  return (
    <div className='card h-100 w-100 bg-transparent border-0'>
      <div className='card-header placeholder-wave border-0 bg-transparent'>
        <span className='p-3 w-100 placeholder'></span>
      </div>
      <div className='card-body p-0 placeholder-wave'>
        <span className='h-100 w-100 placeholder'></span>
      </div>
    </div>
  );
}
export default BasePlaceholder;
