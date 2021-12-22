import React, { FormEvent, useEffect, useRef, useState } from 'react';

import { confirm_leave, showModal } from '../../confirm-modal';
import {
  off,
  set,
  push,
  getRef,
  child,
  remove,
  onValue,
  onDisconnect,
  onChildAdded,
  onChildRemoved,
} from '../../firebase';
import { hideSpinner, showSpinner } from '../../spinner';
import { showToast } from '../../toast';
import { MessageList, Obj_String, Props_Room } from '../../types';
import FormDropDown from './FormDropDown';
import InMessage from './InMessage';
import OutMessage from './OutMessage';

function Room({
  login_user,
  friends_online,
  host_id,
  room_id,
  room_title,
  active_tab,
}: Props_Room) {
  const [chats, setChats] = useState<MessageList>({ messages: [] });
  const [joined_list, setJoinedList] = useState<Obj_String>({});
  const message_input = useRef<HTMLInputElement>(null);
  const messages_body = useRef<HTMLDivElement>(null);
  const tab_panel = useRef<HTMLDivElement>(null);

  const leaveRoom = () => {
    confirm_leave!.dataset.room_id = room_id;
    showModal();
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    try {
      showSpinner();
      event.preventDefault();
      await push(getRef(`${host_id}/rooms/${room_id}/messages`), {
        id: login_user._id,
        name: login_user.name,
        msg: message_input.current!.value,
      });
      message_input.current!.value = '';
      hideSpinner();
    } catch (error: any) {
      hideSpinner();
      showToast(error.message);
    }
  };

  useEffect(() => {
    const ref_room = getRef(`${host_id}/rooms/${room_id}`);
    const ref_messages = child(ref_room, 'messages');
    const ref_joined = child(ref_room, 'joined');
    const ref_joined_self = child(ref_joined, login_user._id);
    const connect_info = getRef('.info/connected');
    const infoHandler = async (online: any) => {
      if (online.val()) {
        try {
          await set(ref_joined_self, login_user.name);
          onDisconnect(ref_joined_self).remove();
        } catch (error: any) {
          showToast(error.message);
        }
      }
    };
    onValue(connect_info, infoHandler);
    onChildAdded(ref_messages, (message) => {
      const { name, msg, id } = message.val();
      chats.messages.push({
        user_name: name,
        message: msg,
        is_self: id === login_user._id,
      });
      setChats({ ...chats });
    });
    onChildAdded(ref_joined, (user) => {
      joined_list[user.key!] = user.val();
      setJoinedList({ ...joined_list });
    });
    onChildRemoved(ref_joined, (user) => {
      delete joined_list[user.key!];
      setJoinedList({ ...joined_list });
    });
    return () => {
      off(connect_info, 'value', infoHandler);
      off(ref_joined);
      off(ref_messages);
      remove(ref_joined_self)
        .then(() => {
          onDisconnect(ref_joined_self).cancel();
        })
        .catch((error) => {
          showToast(error.message);
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const children = messages_body.current!.children;
    const last = children[children.length - 1];
    if (last) {
      last.scrollIntoView();
    }
  }, [chats]);

  useEffect(() => {
    if (!active_tab.current) {
      active_tab.current = room_id;
      document
        .getElementById(`tab-${room_id}`)!
        .classList.toggle('active', true);
      tab_panel.current!.classList.toggle('show', true);
      tab_panel.current!.classList.toggle('active', true);
    }
  });

  return (
    <div className='tab-pane fade h-100' id={room_id} ref={tab_panel}>
      <div className='card h-100 border-0 bg-transparent'>
        <div className='card-header d-flex flex-nowrap p-0 align-items-center border-0'>
          <ul className='nav flex-nowrap border-0'>
            <li className='nav-item'>
              <button
                className='btn active py-0 position-relative'
                title='chats'
                data-bs-toggle='tab'
                data-bs-target={`#${room_id}-chats`}>
                <img src='chat.svg' alt='chats' />
                <small className='position-absolute top-100 start-50 translate-middle badge'>
                  Chats
                </small>
              </button>
            </li>
            <li className='nav-item'>
              <button
                className='btn py-0 position-relative'
                title='joined list'
                data-bs-toggle='tab'
                data-bs-target={`#${room_id}-joined`}>
                <img src='join-list.svg' alt='joined list' />
                <small className='position-absolute top-100 start-50 translate-middle badge'>
                  Joined
                </small>
              </button>
            </li>
            <li className='nav-item'>
              <button
                className='btn py-0 position-relative'
                onClick={leaveRoom}
                title='exit room'>
                <img src='exit.svg' alt='exit room' />
                <small className='position-absolute top-100 start-50 translate-middle badge'>
                  Exit
                </small>
              </button>
            </li>
          </ul>
          {login_user._id === host_id ? (
            <FormDropDown
              friends_online={friends_online}
              joined={joined_list}
              room_id={room_id}
              room_title={room_title}
              login_user={login_user}
            />
          ) : null}
        </div>

        <div className='card-body p-0 overflow-auto'>
          <div className='tab-content h-100'>
            <div
              className='tab-pane fade show active h-100'
              id={`${room_id}-chats`}>
              <div className='card h-100 w-100 border-0 bg-transparent'>
                <div className='card-body overflow-auto' ref={messages_body}>
                  {chats.messages.map((msg, i) => {
                    return msg.is_self ? (
                      <OutMessage
                        key={`${room_id}-${i}`}
                        message={msg.message}
                      />
                    ) : (
                      <InMessage
                        key={`${room_id}-${i}`}
                        user_name={msg.user_name}
                        message={msg.message}
                      />
                    );
                  })}
                </div>
                <div className='card-footer p-0 border-0'>
                  <form className='d-flex' onSubmit={sendMessage} noValidate>
                    <input
                      type='search'
                      className='form-control'
                      placeholder='type here'
                      autoComplete='off'
                      ref={message_input}
                    />
                    <button className='btn btn-outline-primary' type='submit'>
                      <img
                        className='img-fluid float-start'
                        src='caret-right.svg'
                        alt='send'
                      />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className='tab-pane fade h-100' id={`${room_id}-joined`}>
              <div className='card h-100 text-center border-0 bg-transparent rounded-0'>
                <div className='card-body overflow-auto'>
                  <ol className='list-group list-group-flush list-group-numbered h-100'>
                    {Object.keys(joined_list).map((friend_id) => {
                      return (
                        <li
                          key={`joined-${room_id}-${friend_id}`}
                          title={joined_list[friend_id]}
                          className='list-group-item text-nowrap d-flex align-items-center bg-transparent border-white text-light'>
                          <small className='flex-fill text-truncate text-capitalize ms-1'>
                            {joined_list[friend_id]}
                          </small>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Room;
