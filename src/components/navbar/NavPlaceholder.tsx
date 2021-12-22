import React, { useEffect, useRef } from 'react';

import { API_CREATE_USER, API_OPTIONS } from '../../api';
import { AUTH_UI_CONTAINER, login } from '../../auth-ui';
import { auth } from '../../firebase';
import { hideSpinner, showSpinner } from '../../spinner';
import { showToast } from '../../toast';
import { Props_NavPlaceholder, uiShown_unsubscribe } from '../../types';

function NavPlaceholder({ setLoginUser }: Props_NavPlaceholder) {
  const uishown_unsubcribe = useRef<uiShown_unsubscribe | null>(null);

  const uiShown = () => {
    if (uishown_unsubcribe.current) {
      uishown_unsubcribe.current();
      uishown_unsubcribe.current = null;
    }
    AUTH_UI_CONTAINER.classList.toggle('d-none', false);
  };

  const loginSuccess = ({ additionalUserInfo, user }: any) => {
    if (additionalUserInfo.isNewUser) {
      showSpinner();
      fetch(API_CREATE_USER, {
        ...API_OPTIONS,
        body: JSON.stringify({
          _id: user.uid,
          name: user.displayName,
        }),
      })
        .then(({ ok }) => {
          if (!ok) {
            user.delete();
            throw new Error('Failed creating new user.');
          }
          setLoginUser({ _id: user.uid, name: user.displayName });
          hideSpinner();
        })
        .catch((error) => {
          hideSpinner();
          showToast(error.message);
        });
    } else {
      setLoginUser({ _id: user.uid, name: user.displayName });
    }
    AUTH_UI_CONTAINER.classList.toggle('d-none', true);
    return false;
  };
  const loginHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.stopPropagation();
      login(loginSuccess, uiShown);
    } catch (error: any) {
      showToast(error.message);
    }
  };
  useEffect(() => {
    uishown_unsubcribe.current = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoginUser({ name: user.displayName!, _id: user.uid });
      }
    });
    return () => {
      if (uishown_unsubcribe.current) {
        uishown_unsubcribe.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='card-header container-fluid border-0 bg-transparent'>
      <div className='row align-items-center'>
        <span className='col-lg-2 fs-3 d-none d-lg-inline-block text-center'>ChatBox</span>
        <div className='col-lg-8 col-9 placeholder-wave'>
          <span className='p-4 placeholder w-100'></span>
        </div>
        <button
          className='col-lg-2 col-3 btn btn-outline-primary text-white fs-4'
          onClick={loginHandler}>
          Login
        </button>
      </div>
    </div>
  );
}
export default NavPlaceholder;
