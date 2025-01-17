import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";
import roleRoutes from './routes/roleRoutes';
import userRouter from './routes/userRoutes';
import counterRouter from './routes/counterRoutes';
import issueRouter from './routes/issueRoutes';

import * as dotenv from "dotenv";
import connectDB from './typeorm';
import { Issue } from './entities/Issue';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
connectDB;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Ensure this matches your frontend URL without trailing slash
  methods: ['GET', 'POST','PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use("/roles", roleRoutes);
app.use("/user", userRouter);
app.use("/counter", counterRouter);
app.use("/issue", issueRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update this to match your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on('connection', (socket) => {

  socket.on('joinCounter', (counterId) => {
    socket.join(counterId);
  });

  //send issue to specific counter
  socket.on("issueAdded", (newIssue) => {
    io.to(newIssue.counterId).emit("issueAdded", newIssue);
  });

  // Send multiple issues to specific counter
  socket.on("issuesAdded", (newIssues) => {
    if (Array.isArray(newIssues) && newIssues.length > 0) {
      const counterId = newIssues[0].counterId;
      io.to(counterId).emit("issuesAdded", newIssues);
    }
  });


  // Event to join a room
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Event to join a counter room
  socket.on('joinCounterRoom', (counterName) => {
    socket.join(counterName);
    console.log(`Joined counter room ${counterName}`);
  });

  // Listen for call events from the counter
  socket.on('callUser', (data) => {
    console.log(`Calling user with ID: ${data.userId} to counter ${data.counterName}`);
    // Notify the specific user (data.userId) about the call
    io.to(data.userId).emit('callNotification', {
      message: `You are being called to the counter ${data.counterName}`,
    });
  });

  // Listen for call events from the counter
  socket.on('curruntToken', (data) => {
    console.log("Currunt Token:",data)
    io.to(data.counterName).emit('callTokenNo', {
      token: data.tokenNo,
      nextToken: data.nextTokenNo
    });
  });

  // Listen for issue done events
  socket.on('issueDone', (data) => {
    // Broadcast the issueDone event to all connected clients
    io.emit('issueDone', data);
  });

   // Listen for issue canceled events
   socket.on('issueCanceled', (canceledIssue) => {
    console.log(`Issue canceled: ${canceledIssue.issueId}`);
    io.to(canceledIssue.counterId).emit('issueCanceled', canceledIssue);
  });

  socket.on('changeCounter', (newIssues) => {
    console.log("this new issues: ", newIssues)
      io.emit("changeCounter", newIssues);
  })

  // socket.on('disconnect', () => {
  //   console.log('Client disconnected');
  // });
});

// app.set("io", io); // Store io instance in app for global use

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
