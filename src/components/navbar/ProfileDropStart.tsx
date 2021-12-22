import React, { useEffect } from 'react';

import { getRef, onValue, set, onDisconnect, off, auth } from '../../firebase';
import { hideSpinner, showSpinner } from '../../spinner';
import { showToast } from '../../toast';
import { Props_ProfileDropStart } from '../../types';

function ProfileDropStart({
  login_user,
  setLoginUser,
}: Props_ProfileDropStart) {
  const logout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      showSpinner();
      event.stopPropagation();
      const online = getRef(`${login_user._id}/status`);
      await set(online, false);
      onDisconnect(online).cancel();
      sessionStorage.removeItem('rooms');
      await auth.signOut();
      setLoginUser(null);
      hideSpinner();
    } catch (error: any) {
      hideSpinner();
      showToast(error.message);
    }
  };

  useEffect(() => {
    const online = getRef(`${login_user._id}/status`);
    const connect_info = getRef('.info/connected');
    onValue(connect_info, (connected) => {
      if (connected.val()) {
        set(online, true);
        onDisconnect(online).set(false);
      }
    });
    return () => {
      off(connect_info);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='dropstart flex-shrink-0'>
      <button className='btn btn-outline-primary p-1' data-bs-toggle='dropdown'>
        <img
          className='img-fluid float-start'
          src='person-circle.svg'
          alt='user profile'
        />
      </button>
      <div
        className='dropdown-menu text-center bg-fire text-white'
        style={{ maxWidth: '50vw' }}>
        <div className='d-flex align-items-center p-1'>
          <small className='flex-fill text-nowrap text-capitalize text-truncate fw-bold'>
            {login_user.name}
          </small>
          <button
            className='btn btn-outline-secondary p-0 mx-1 fw-bold'
            onClick={logout}
            style={{ fontSize: '.75rem' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileDropStart;
