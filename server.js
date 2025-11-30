// server.js
import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
    }
});

// AUTH MIDDLEWARE
io.use(async (socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers.authorization?.split(" ")[1];

        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId))
            return next(new Error("Invalid projectId"));

        socket.project = await projectModel.findById(projectId);

        if (!token) return next(new Error("Authentication error"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
});

io.on("connection", (socket) => {
    socket.roomId = socket.project._id.toString();
    socket.join(socket.roomId);

    console.log("a user connected");

    // ⭐ FIXED SOCKET HANDLER — NO DATABASE SAVE HERE
    socket.on("project-message", async (data) => {
        // Just broadcast — DO NOT SAVE AGAIN
        socket.broadcast.to(socket.roomId).emit("project-message", data);

        // AI message handling
        const { message } = data;
        const isAi = message.includes("@ai");

        if (isAi) {
            const prompt = message.replace("@ai", "");

            const aiResponse = await generateResult(prompt);

            // Emit AI message (API will save this separately)
            io.to(socket.roomId).emit("project-message", {
                sender: { _id: "ai", email: "AI" },
                message: aiResponse,
                createdAt: new Date()
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        socket.leave(socket.roomId);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
