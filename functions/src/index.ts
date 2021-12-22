import { https, database } from 'firebase-functions';
import { connect } from 'mongoose';
import express from 'express';
import cors from 'cors';

import { MONGO_URI } from './mongodb-uri';
import {
  newUser,
  addFriend,
  friendsGuests,
  guests,
  online,
  friends,
} from './mongodb';

connect(MONGO_URI, { autoIndex: false });
const app = express();
app.use(cors());
app.use(express.json());

app.post('/new-user', async (request, response) => {
  try {
    const { _id, name } = request.body;
    const user = {
      _id,
      name,
    };
    await newUser(user);
    response.sendStatus(200);
  } catch {
    response.sendStatus(500);
  }
});

app.post('/friends-guests', async (req, res) => {
  try {
    const { _id } = req.body;
    const friends_guests = await friendsGuests(_id);
    res.json(friends_guests);
  } catch {
    res.sendStatus(500);
  }
});

app.post('/friends', async (req, res) => {
  try {
    const { _id } = req.body;
    const friend_list = await friends(_id);
    res.json(friend_list);
  } catch {
    res.sendStatus(500);
  }
});

app.post('/add-friend', async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;
    await addFriend(user_id, friend_id);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.post('/guests', async (req, res) => {
  try {
    const { _id, name } = req.body;
    const guest_list = await guests(_id, name);
    res.json(guest_list);
  } catch {
    res.sendStatus(500);
  }
});

const cloud_function = https.onRequest(app);
const db_trigger = database
  .ref('{uid}/status')
  .onWrite(async (change, context) => {
    await online(context.params.uid, change.after.val());
  });

export { cloud_function, db_trigger };
