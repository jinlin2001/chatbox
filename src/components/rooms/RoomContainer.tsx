import React, {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import {
  ChatRequest,
  Obj_ChatRequest,
  Props_RoomsContainer,
  Ref_NewRoom,
} from '../../types';
import { push, getRef, get, remove, child } from '../../firebase';
import { hideSpinner, showSpinner } from '../../spinner';
import { confirm_leave, hideModal } from '../../confirm-modal';
import { showToast } from '../../toast';
import Room from './Room';

const RoomContainer = forwardRef<Ref_NewRoom, Props_RoomsContainer>(
  ({ login_user, friends_online }, ref) => {
    const [rooms, setRooms] = useState<Obj_ChatRequest>({});
    const dropdown_btn = useRef<HTMLButtonElement>(null);
    const dropdown_input = useRef<HTMLInputElement>(null);
    const active_tab = useRef<string | null>(null);
    const room_ids = Object.keys(rooms);

    const newRoom = (room: ChatRequest) => {
      rooms[room.room_id] = room;
      sessionStorage.setItem('rooms', JSON.stringify(rooms));
      setRooms({ ...rooms });
    };

    const formHandler = async (event: FormEvent<HTMLFormElement>) => {
      try {
        event.preventDefault();
        showSpinner();
        const room_title = dropdown_input.current!.value.trim();
        if (room_title === '') {
          throw new Error('Title cannot be empty string.');
        }
        const { key } = await push(getRef(`${login_user._id}/room_ids`), true);
        newRoom({
          host_id: login_user._id,
          host_name: login_user.name,
          room_id: key!,
          room_title,
        });
        dropdown_input.current!.value = '';
        dropdown_btn.current!.click();
        hideSpinner();
      } catch (error: any) {
        hideSpinner();
        showToast(error.message);
      }
    };

    useEffect(() => {
      try {
        const session_rooms = sessionStorage.getItem('rooms');
        if (session_rooms) {
          const json_rooms = JSON.parse(session_rooms);
          setRooms(json_rooms);
        }
      } catch {}
    }, []);
    useEffect(() => {
      (async () => {
        try {
          const rooms = await get(getRef(`${login_user._id}/room_ids`));
          const room_ids = rooms.val();
          if (room_ids) {
            for (const id of Object.keys(room_ids)) {
              get(getRef(`${login_user._id}/rooms/${id}/joined`))
                .then((data_child) => {
                  if (!data_child.val()) {
                    remove(data_child.ref.parent!);
                    remove(child(rooms.ref, id));
                  }
                })
                .catch(() => {});
            }
          }
        } catch {}
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const leaveRoom = () => {
        try {
          delete rooms[confirm_leave!.dataset.room_id!];
          active_tab.current = null;
          sessionStorage.setItem('rooms', JSON.stringify(rooms));
          setRooms({ ...rooms });
          hideModal();
        } catch (error: any) {
          showToast(error.message);
        }
      };
      confirm_leave!.addEventListener('click', leaveRoom);
      return () => {
        confirm_leave?.removeEventListener('click', leaveRoom);
      };
    }, [rooms]);

    useImperativeHandle(
      ref,
      () => {
        return { newRoom };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [rooms]
    );

    return (
      <div className='col-12 col-md-8 col-lg-6 h-100'>
        <div className='card h-100 border-0 rounded-0 bg-transparent'>
          <div className='card-header dropdown p-0 border-0 m-0 bg-transparent'>
            <button
              className='btn btn-outline-primary dropdown-toggle w-100 text-light'
              data-bs-toggle='dropdown'
              data-bs-auto-close='outside'
              ref={dropdown_btn}>
              Create Room
            </button>
            <div className='dropdown-menu w-100 p-0'>
              <form className='form-floating' onSubmit={formHandler} noValidate>
                <input
                  id='create-room-input'
                  type='search'
                  className='form-control'
                  autoComplete='off'
                  placeholder='Room Title'
                  ref={dropdown_input}
                />
                <label htmlFor='create-room-input'>Room Title</label>
              </form>
            </div>
          </div>

          <div className='card-body p-0 overflow-auto d-flex flex-column'>
            <ul className='nav border-0'>
              {room_ids.map((id) => {
                const key = `tab-${id}`;
                return (
                  <li className='nav-item' key={key}>
                    <button
                      id={key}
                      className='btn py-0 fw-bold'
                      data-bs-toggle='tab'
                      data-bs-target={`#${id}`}>
                      {rooms[id].room_title}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className='tab-content flex-fill overflow-auto'>
              {room_ids.map((id, i) => {
                return (
                  <Room
                    key={`room-${id}`}
                    host_id={rooms[id].host_id}
                    room_id={id}
                    room_title={rooms[id].room_title}
                    active_tab={active_tab}
                    login_user={login_user}
                    friends_online={friends_online}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default RoomContainer;
