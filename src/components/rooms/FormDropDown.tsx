import React, { FormEvent, useRef, useState } from 'react';

import { hideSpinner, showSpinner } from '../../spinner';
import { showToast } from '../../toast';
import { Obj_Boolean, Props_InviteForm } from '../../types';
import { set, getRef, push } from '../../firebase';
import CheckBox from './CheckBox';

function FormDropDown({
  friends_online,
  joined,
  room_id,
  room_title,
  login_user,
}: Props_InviteForm) {
  const [invited, setInvited] = useState<Obj_Boolean>({});
  const form_control = useRef<HTMLFormElement>(null);
  const btn_control = useRef<HTMLButtonElement>(null);
  const dropdown_btn = useRef<HTMLButtonElement>(null);

  const sendInvitation = async (event: FormEvent<HTMLFormElement>) => {
    try {
      showSpinner();
      event.preventDefault();
      const invitations_list =
        form_control.current!.querySelectorAll<HTMLInputElement>(
          'div>input:checked'
        );
      if (invitations_list.length < 1) {
        throw new Error('No friends selected.');
      }
      for (const checkbox of invitations_list) {
        await set(
          getRef(
            `${login_user._id}/rooms/${room_id}/allowed/${checkbox.value}`
          ),
          true
        );
        await push(getRef(`${checkbox.value}/connect`), {
          host_id: login_user._id,
          host_name: login_user.name,
          room_title,
          room_id,
        });
        checkbox.checked = false;
        invited[checkbox.value] = true;
      }
      setInvited({ ...invited });
      dropdown_btn.current!.click();
      hideSpinner();
    } catch (error: any) {
      hideSpinner();
      setInvited({ ...invited });
      dropdown_btn.current!.click();
      showToast(error.message);
    }
  };

  return (
    <div className='dropdown flex-fill'>
      <button
        className='btn btn-outline-primary w-100 dropdown-toggle py-0 text-light'
        data-bs-toggle='dropdown'
        data-bs-auto-close='outside'
        ref={dropdown_btn}>
        Invite
      </button>

      <div
        className='dropdown-menu w-100 p-0 bg-fire text-white'
        style={{ minWidth: '45vw' }}
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {friends_online ? (
          friends_online.length > 0 ? (
            <div className='card text-center bg-transparent'>
              <div
                className='card-body overflow-auto'
                style={{ maxHeight: '45vh' }}>
                <form
                  id={`form-${room_id}`}
                  ref={form_control}
                  onSubmit={sendInvitation} noValidate>
                  {friends_online.map((friend, i) => {
                    const key = `checkbox-${room_id}-${friend._id}-${i}`;
                    return (
                      <CheckBox
                        key={key}
                        id={key}
                        friend={friend}
                        joined={friend._id in joined}
                        invited={friend._id in invited}
                      />
                    );
                  })}
                </form>
              </div>
              <div className='card-footer p-0'>
                <button
                  type='submit'
                  className='btn btn-sm btn-outline-primary w-100 text-white'
                  form={`form-${room_id}`}
                  ref={btn_control}>
                  Send Invitation
                </button>
              </div>
            </div>
          ) : (
            <p className='text-center m-0 p-2 border-0'>No friends online.</p>
          )
        ) : null}
      </div>
    </div>
  );
}

export default FormDropDown;
