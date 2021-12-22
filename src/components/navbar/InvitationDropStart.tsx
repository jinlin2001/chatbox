import React, { useEffect, useState } from 'react';

import {
  ChatRequest,
  Obj_ChatRequest_Time,
  Props_InvitationDropStart,
} from '../../types';
import { getRef, onChildAdded, remove, off } from '../../firebase';
import { hideSpinner, showSpinner } from '../../spinner';
import { showToast } from '../../toast';

function InvitationDropStart({
  login_user,
  newRoom,
}: Props_InvitationDropStart) {
  const [invitations_received, setInvitations] = useState<Obj_ChatRequest_Time>(
    {}
  );
  const invitation_keys = Object.keys(invitations_received);

  const joinHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      showSpinner();
      event.stopPropagation();
      const { invitation_key } = event.currentTarget.dataset;
      newRoom(invitations_received[invitation_key!].request);
      delete invitations_received[invitation_key!];
      setInvitations({ ...invitations_received });
      hideSpinner();
    } catch (error: any) {
      hideSpinner();
      showToast(error.message);
    }
  };

  const dismissHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      showSpinner();
      event.stopPropagation();
      delete invitations_received[event.currentTarget.dataset.invitation_key!];
      setInvitations({ ...invitations_received });
      hideSpinner();
    } catch (error: any) {
      hideSpinner();
      showToast(error.message);
    }
  };

  useEffect(() => {
    const channel_ref = getRef(`${login_user._id}/connect`);
    onChildAdded(channel_ref, (snapshot) => {
      remove(snapshot.ref)
        .then(() => {
          const chat_request: ChatRequest = snapshot.val();
          setInvitations({
            ...invitations_received,
            [`${chat_request.host_id}-${chat_request.room_id}`]: {
              request: chat_request,
              time: new Date().toLocaleTimeString(),
            },
          });
        })
        .catch(() => {});
    });
    return () => {
      off(channel_ref);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitations_received]);

  return (
    <div className='dropstart flex-shrink-0'>
      <button
        className='btn btn-outline-primary position-relative p-1 mx-2 shrink-0'
        data-bs-toggle='dropdown'>
        <img
          className='img-fluid float-start'
          src='bell.svg'
          alt='notification'
        />
        <small className='position-absolute top-0 start-100 translate-middle bg-warning px-1 fw-bold badge'>
          {invitation_keys.length}
        </small>
      </button>
      <div
        className='dropdown-menu overflow-auto text-center p-0 bg-fire text-white'
        style={{ width: '15rem', maxHeight: '50vh' }}>
        {invitation_keys.length > 0 ? (
          invitation_keys.map((key) => {
            return (
              <div
                key={`invitation-${key}`}
                className='d-flex p-1 border-bottom border-3'>
                <div className='flex-fill row row-cols-1 g-0 text-nowrap overflow-auto'>
                  <small className='col'>Invitation from</small>
                  <small
                    className='col text-truncate fw-bold'
                    title={invitations_received[key].request.host_name}>
                    {invitations_received[key].request.host_name}
                  </small>
                  <small className='col'>
                    on &nbsp;
                    <small className='fw-bold'>
                      {invitations_received[key].time}
                    </small>
                  </small>
                </div>
                <div className='row row-cols-1 gy-1 gx-0'>
                  <button
                    className='col btn btn-outline-light p-0 px-1 fw-bold'
                    onClick={joinHandler}
                    data-invitation_key={key}
                    style={{ fontSize: '.75rem' }}>
                    Join
                  </button>
                  <button
                    className='col btn btn-outline-secondary p-0 fw-bold'
                    onClick={dismissHandler}
                    data-invitation_key={key}
                    style={{ fontSize: '.75rem' }}>
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className='m-0 p-1'>No Invitations.</p>
        )}
      </div>
    </div>
  );
}
export default InvitationDropStart;
