# Friend Request — Full Setup (TypeScript + Node + Mongoose + Socket.IO)

এই ডকিউমেন্টে আমি সম্পূর্ণ কোড দিলাম — Models, Services, Controllers, Routes, Zod validation, এবং Socket.IO integration। আপনি Student এবং Teacher আলাদা মডেল ব্যবহার করছেন বলে আমি উভয়কে সাপোর্ট করে করেছি (refPath ব্যবহার করে)।

---

## 0. package.json (dependencies)

```json
{
  "name": "friend-request-app",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "zod": "^3.0.0",
    "socket.io": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.0",
    "@types/node": "^18.0.0"
  }
}
```

---

## 1. src/models/student.model.ts

```ts
import { Schema, model } from 'mongoose';

const studentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const Student = model('Student', studentSchema);
```

---

## 2. src/models/teacher.model.ts

```ts
import { Schema, model } from 'mongoose';

const teacherSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const Teacher = model('Teacher', teacherSchema);
```

---

## 3. src/models/friendRequest.model.ts

```ts
import { Schema, model } from 'mongoose';

export enum REQUEST_STATUS {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
}

const friendRequestSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'receiverModel',
    },
    senderModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
    receiverModel: {
      type: String,
      required: true,
      enum: ['Student', 'Teacher'],
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.pending,
    },
  },
  { timestamps: true },
);

export const FriendRequest = model('FriendRequest', friendRequestSchema);
```

---

## 4. src/models/friend.model.ts

```ts
import { Schema, model } from 'mongoose';

const friendSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, refPath: 'userModel' },
    friend: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'friendModel',
    },
    userModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
    friendModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
  },
  { timestamps: true },
);

friendSchema.index({ user: 1, friend: 1 }, { unique: true });

export const Friend = model('Friend', friendSchema);
```

---

## 5. src/validation/friendRequest.zod.ts

```ts
import { z } from 'zod';

export const sendRequestSchema = z.object({
  body: z.object({
    senderId: z.string().min(1),
    senderModel: z.enum(['Student', 'Teacher']),
    receiverId: z.string().min(1),
    receiverModel: z.enum(['Student', 'Teacher']),
  }),
});

export const handleRequestSchema = z.object({
  body: z.object({
    requestId: z.string().min(1),
    action: z.enum(['accept', 'reject']),
    actorId: z.string().min(1),
  }),
});
```

---

## 6. src/services/friend.service.ts

```ts
import { FriendRequest, REQUEST_STATUS } from '../models/friendRequest.model';
import { Friend } from '../models/friend.model';
import { Student } from '../models/student.model';
import { Teacher } from '../models/teacher.model';
n;
import mongoose from 'mongoose';

const getModelByName = (name: 'Student' | 'Teacher') =>
  name === 'Student' ? Student : Teacher;

export const sendFriendRequest = async (
  senderId: string,
  senderModel: 'Student' | 'Teacher',
  receiverId: string,
  receiverModel: 'Student' | 'Teacher',
) => {
  // prevent sending to self
  if (senderId === receiverId && senderModel === receiverModel)
    throw new Error('Cannot send request to yourself');

  // check receiver exists
  const Receiver = getModelByName(receiverModel);
  const receiver = await Receiver.findById(receiverId);
  if (!receiver) throw new Error('Receiver not found');

  // check existing friendship
  const alreadyFriend = await Friend.findOne({
    user: senderId,
    friend: receiverId,
  });
  if (alreadyFriend) throw new Error('Already friends');

  // check pending request between same pair
  const existing = await FriendRequest.findOne({
    $or: [
      {
        sender: senderId,
        receiver: receiverId,
        status: REQUEST_STATUS.pending,
      },
      {
        sender: receiverId,
        receiver: senderId,
        status: REQUEST_STATUS.pending,
      },
    ],
  });
  if (existing) throw new Error('Pending request already exists');

  const request = await FriendRequest.create({
    sender: senderId,
    senderModel,
    receiver: receiverId,
    receiverModel,
  });
  return request;
};

export const handleFriendRequest = async (
  requestId: string,
  actorId: string,
  action: 'accept' | 'reject',
) => {
  const request = await FriendRequest.findById(requestId);
  if (!request) throw new Error('Request not found');

  // only receiver can accept/reject
  if (request.receiver.toString() !== actorId)
    throw new Error('Not authorized');

  if (request.status !== REQUEST_STATUS.pending)
    throw new Error('Request already handled');

  if (action === 'reject') {
    request.status = REQUEST_STATUS.rejected;
    await request.save();
    return request;
  }

  // accept flow
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    request.status = REQUEST_STATUS.accepted;
    await request.save({ session });

    // create two friend entries
    await Friend.create(
      [
        {
          user: request.sender,
          friend: request.receiver,
          userModel: request.senderModel,
          friendModel: request.receiverModel,
        },
        {
          user: request.receiver,
          friend: request.sender,
          userModel: request.receiverModel,
          friendModel: request.senderModel,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return request;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const areFriends = async (aId: string, bId: string) => {
  const f = await Friend.findOne({ user: aId, friend: bId });
  return !!f;
};
```

---

## 7. src/controllers/friend.controller.ts

```ts
import { Request, Response } from 'express';
import * as service from '../services/friend.service';
import {
  sendRequestSchema,
  handleRequestSchema,
} from '../validation/friendRequest.zod';

export const sendRequest = async (req: Request, res: Response) => {
  const parsed = sendRequestSchema.safeParse({ body: req.body });
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.format() });

  try {
    const r = await service.sendFriendRequest(
      parsed.data.body.senderId,
      parsed.data.body.senderModel,
      parsed.data.body.receiverId,
      parsed.data.body.receiverModel,
    );
    return res.json(r);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const handleRequest = async (req: Request, res: Response) => {
  const parsed = handleRequestSchema.safeParse({ body: req.body });
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.format() });

  try {
    const r = await service.handleFriendRequest(
      parsed.data.body.requestId,
      parsed.data.body.actorId,
      parsed.data.body.action as 'accept' | 'reject',
    );
    return res.json(r);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const checkFriend = async (req: Request, res: Response) => {
  const { aId, bId } = req.query as any;
  const f = await service.areFriends(aId, bId);
  return res.json({ areFriends: f });
};
```

---

## 8. src/routes/friend.routes.ts

```ts
import { Router } from 'express';
import * as ctrl from '../controllers/friend.controller';

const router = Router();

router.post('/send', ctrl.sendRequest);
router.post('/handle', ctrl.handleRequest);
router.get('/check', ctrl.checkFriend);

export default router;
```

---

## 9. src/index.ts (server + socket)

```ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import friendRoutes from './routes/friend.routes';

const app = express();
app.use(express.json());

app.use('/api/friend', friendRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// basic socket map for userId -> socketId (in memory)
const userSocketMap = new Map<string, string>();

io.on('connection', (socket) => {
  // client should emit 'identify' with their userId when connect
  socket.on('identify', (userId: string) => {
    userSocketMap.set(userId, socket.id);
  });

  socket.on('disconnect', () => {
    for (const [k, v] of userSocketMap.entries()) {
      if (v === socket.id) userSocketMap.delete(k);
    }
  });
});

// helper to emit notification
export const notifyUser = (userId: string, event: string, payload: any) => {
  const socketId = userSocketMap.get(userId);
  if (!socketId) return;
  io.to(socketId).emit(event, payload);
};

// connect mongoose and start
const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/friend-db';
mongoose
  .connect(MONGO)
  .then(() => console.log('mongo connected'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('listening', PORT));
```

---

## 10. Example: Emitting socket notification after send/accept

- In `sendFriendRequest` service, after creating request, call `notifyUser(receiverId, 'friend_request_received', { requestId: request._id, from: senderId })` so receiver gets a push notification.
- In `handleFriendRequest` when accept, call `notifyUser(request.sender.toString(), 'friend_request_accepted', { requestId: request._id, by: request.receiver })`.

---

## 11. Notes & Tips

- I used separate Student/Teacher models and `refPath` so Request and Friend entries can reference either model.
- For production persist socket-user mapping in Redis if you have multiple servers.
- Use transactions (I used mongoose session) to atomically create friendship entries.
- Validate inputs and add authentication middleware (JWT) in controllers — actorId should be taken from auth token not from client body.

---
