// services/project.service.js
import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, userId }) => {
    if (!name) throw new Error("Name is required");
    if (!userId) throw new Error("UserId is required");

    const project = await projectModel.create({
        name,
        users: [userId],
        messages: []
    });

    return project;
};

export const saveMessage = async ({ projectId, sender, message }) => {
    if (!projectId || !sender || !message) {
        throw new Error("projectId, sender and message are required");
    }

    const updated = await projectModel.findByIdAndUpdate(
        projectId,
        {
            $push: {
                messages: {
                    sender,
                    message,
                    createdAt: new Date()
                }
            }
        },
        { new: true }
    );

    return updated;
};

export const getMessages = async ({ projectId }) => {
    if (!projectId) throw new Error("projectId is required");

    const project = await projectModel.findById(projectId);

    return project?.messages || [];
};

export const getAllProjectByUserId = async ({ userId }) => {
    if (!userId) throw new Error("UserId is required");

    const projects = await projectModel.find({ users: userId });
    return projects;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
    if (!projectId || !users) throw new Error("projectId and users are required");

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    });

    if (!project) throw new Error("User not authorized on this project");

    const updated = await projectModel.findByIdAndUpdate(
        projectId,
        {
            $addToSet: { users: { $each: users } }
        },
        { new: true }
    );

    return updated;
};

export const getProjectById = async ({ projectId }) => {
    const project = await projectModel.findById(projectId).populate("users");
    return project;
};

export const updateFileTree = async ({ projectId, fileTree }) => {
    const updated = await projectModel.findByIdAndUpdate(
        projectId,
        { fileTree },
        { new: true }
    );
    return updated;
};
