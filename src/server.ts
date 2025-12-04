/* eslint-disable no-console */
import http from 'http';
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'socket.io';
let server: http.Server;

async function main() {
  try {
    console.log('Attempting to connect to the database...');
    await mongoose.connect(config.database_url as string);
    console.log('Database connection established successfully.');
    server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    // Socket.IO ইভেন্ট হ্যান্ডেলার
    io.on('connection', (socket) => {
      // প্রতিটি নতুন কানেকশনের জন্য একটি ইউনিক socket.id তৈরি হয়
      console.log('একজন ইউজার কানেক্ট হয়েছে:', socket.id);

      // ক্লায়েন্ট থেকে মেসেজ পাওয়া
      socket.on('message', (data) => {
        console.log('মেসেজ পেয়েছি:', data);
        // সব ক্লায়েন্টকে মেসেজ পাঠানো
        io.emit('message', data);

        // ডিসকানেক্ট হ্যান্ডেলার

        socket.on('disconnect', () => {
          console.log('ইউজার ডিসকানেক্ট হয়েছে:', socket.id);
        });
      });
      // সার্ভার শুরু করুন
      server.listen(config.port, () => {
        console.log(`অ্যাপটি ${config.port} পোর্টে চলছে`);
        console.log(`Socket.IO ও এই একই পোর্টে চলছে`);
      });
    });
  } catch (error) {
    console.error('ডাটাবেসে কানেক্ট করতে সমস্যা:', error);
  }
}

main();
process.on('unhandledRejection', (err) => {
  console.log(` unhandledRejection is Detected , process exit`);
  console.log(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on('uncaughtException', () => {
  console.log(` uncaughtException is Detected , process exit`);
  process.exit(1);
});
