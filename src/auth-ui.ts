import * as UI from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

import { auth, EmailAuthProvider } from './firebase';
import { signInSuccess, uiShown_unsubscribe } from './types';

const authui = new UI.auth.AuthUI(auth);
const AUTH_UI_CONTAINER = document.getElementById('loginui')!;

function login(handler: signInSuccess, uiShown: uiShown_unsubscribe) {
  authui.start('#loginui-body', {
    callbacks: {
      signInSuccessWithAuthResult: handler,
      uiShown: uiShown,
    },
    signInFlow: 'popup',
    signInOptions: [EmailAuthProvider.PROVIDER_ID],
  });
}

export { login, AUTH_UI_CONTAINER };
