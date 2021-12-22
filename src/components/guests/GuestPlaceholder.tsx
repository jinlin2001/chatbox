import React from 'react';
import BasePlaceholder from '../BasePlaceholder';

function GuestPlaceholder() {
  return (
    <div className='d-none d-lg-block col-lg-3 h-100'>
      <BasePlaceholder />
    </div>
  );
}
export default GuestPlaceholder;
