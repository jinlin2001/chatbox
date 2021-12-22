import { Schema, model } from 'mongoose';

interface User {
  _id: string;
  name: string;
  online?: boolean;
  friends?: [string];
}
const UserModel = model<User>(
  'User',
  new Schema<User>(
    {
      _id: String,
      name: String,
      online: { type: Boolean, default: false },
      friends: { type: [String], default: [] },
    },
    { versionKey: false }
  )
);

async function online(_id: string, online: boolean) {
  await UserModel.findByIdAndUpdate(_id, { online });
}

async function newUser(user: User) {
  await UserModel.create(user);
}

async function addFriend(uId: string, fId: string) {
  await UserModel.findByIdAndUpdate(uId, { $addToSet: { friends: fId } });
}

async function friendsGuests(_id: string) {
  const [result] = await UserModel.aggregate([
    { $match: { _id } },
    {
      $lookup: {
        from: 'users',
        as: 'guests',
        let: { friends: '$friends', id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ['$_id', '$$id'] },
                  { $not: [{ $in: ['$_id', '$$friends'] }] },
                ],
              },
            },
          },
          { $limit: 50 },
          {
            $project: {
              friends: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        let: { friends: '$friends' },
        as: 'friends',
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$friends'],
              },
            },
          },
          {
            $project: {
              friends: 0,
            },
          },
        ],
      },
    },
    {
      $project: { _id: 0, guests: 1, friends: 1 },
    },
  ]);
  return result;
}

async function friends(_id: string) {
  const [result] = await UserModel.aggregate([
    { $match: { _id } },
    {
      $lookup: {
        from: 'users',
        let: { friends: '$friends' },
        as: 'friends',
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$friends'],
              },
            },
          },
          {
            $project: {
              friends: 0,
            },
          },
        ],
      },
    },
    {
      $project: { _id: 0, friends: 1 },
    },
  ]);
  return result.friends;
}

async function guests(_id: string, name: string) {
  const [result] = await UserModel.aggregate([
    { $match: { _id } },
    {
      $lookup: {
        from: 'users',
        as: 'guests',
        pipeline: [
          {
            $match: {
              name: { $regex: `${name}`, $options: 'i' },
            },
          },
          {
            $project: {
              friends: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        guest_list: {
          $filter: {
            input: '$guests',
            as: 'guests',
            cond: {
              $and: [
                { $ne: ['$$guests._id', '$_id'] },
                { $not: [{ $in: ['$$guests._id', '$friends'] }] },
              ],
            },
          },
        },
        _id: 0,
      },
    },
  ]);
  return result.guest_list;
}
export { guests, online, newUser, addFriend, friends, friendsGuests };
