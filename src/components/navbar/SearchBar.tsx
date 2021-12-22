import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';

import { API_OPTIONS, API_SEARCH } from '../../api';
import { hideSpinner, showSpinner } from '../../spinner';
import { showToast } from '../../toast';
import { Guest, Props_SearchBar, Ref_ClearSearch } from '../../types';
import DataList from '../DataList';

const SearchBar = forwardRef<Ref_ClearSearch, Props_SearchBar>(
  ({ login_user, addFriend }, ref) => {
    const [guests, setGuests] = useState<Guest[] | null>(null);
    const input_control = useRef<HTMLInputElement>(null);

    const addFriendHandler = async (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      showSpinner();
      event.stopPropagation();
      const { guest_id, index } = event.currentTarget.dataset;
      await addFriend(guests!, guest_id!, +index!, true);
    };

    const searchHandler = debounce(async () => {
      try {
        showSpinner();
        const search_txt = input_control.current!.value.trim();
        if (search_txt === '') {
          hideSpinner();
          return;
        }
        const api_response = await fetch(API_SEARCH, {
          ...API_OPTIONS,
          body: JSON.stringify({ _id: login_user._id, name: search_txt }),
        });
        if (!api_response.ok) {
          throw new Error('Failed on search.');
        }
        const guests_response: Guest[] = await api_response.json();
        setGuests(guests_response);
        hideSpinner();
      } catch (error: any) {
        hideSpinner();
        showToast(error.message);
      }
    }, 500);

    useImperativeHandle(
      ref,
      () => {
        return {
          clearSearch: () => {
            if (input_control.current!.value !== '' || guests !== null) {
              input_control.current!.value = '';
              setGuests(null);
            }
          },
        };
      },
      [guests]
    );
    return (
      <div className='flex-fill position-relative'>
        <input
          type='search'
          className='form-control'
          placeholder='Search...'
          onInput={searchHandler}
          ref={input_control}
        />
        <div
          className='position-absolute w-100 overflow-auto text-center bg-fire'
          onClick={(event) => {
            event.stopPropagation();
          }}
          style={{ maxHeight: '50vh' }}>
          {guests ? (
            guests.length > 0 ? (
              <DataList
                datalist={guests}
                addFriendHandler={addFriendHandler}
                component_type='search'
              />
            ) : (
              <p className='m-0 p-2'>No Results.</p>
            )
          ) : null}
        </div>
      </div>
    );
  }
);

export default SearchBar;
