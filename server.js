// server.js
import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";
import * as projectService from "./services/project.service.js";

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
        if (!socket.project) return next(new Error("Project not found"));

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

    socket.on("project-message", async (data) => {
        const { sender, message } = data;

        // SAVE USER MESSAGE
        const updated = await projectService.saveMessage({
            projectId: socket.project._id,
            sender,
            message
        });

        const savedMessage = updated.messages[updated.messages.length - 1];

        // BROADCAST USER MESSAGE
        socket.broadcast.to(socket.roomId).emit("project-message", savedMessage);

        // PROCESS AI MESSAGE
        const isAi = message.includes("@ai");
        if (isAi) {
            const prompt = message.replace("@ai", "");

            const aiResponseRaw = await generateResult(prompt);

            let parsed;
            try {
                parsed = JSON.parse(aiResponseRaw);
            } catch {
                parsed = { text: aiResponseRaw, fileTree: null };
            }

            const aiMessage = {
                sender: { _id: "ai", email: "AI" },
                message: JSON.stringify({ text: parsed.text }),
                createdAt: new Date(),
                fileTree: parsed.fileTree || null
            };

            // SAVE AI MESSAGE
            await projectService.saveMessage({
                projectId: socket.project._id,
                sender: { _id: "ai", email: "AI" },
                message: JSON.stringify({ text: parsed.text })
            });

            // SAVE UPDATED FILE TREE (SUPER IMPORTANT)
            if (parsed.fileTree) {
                await projectService.updateFileTree({
                    projectId: socket.project._id,
                    fileTree: parsed.fileTree
                });
            }

            // EMIT TO ALL (INCLUDING SENDER)
            io.to(socket.roomId).emit("project-message", aiMessage);
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        socket.leave(socket.roomId);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
 