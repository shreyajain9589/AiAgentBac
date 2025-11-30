// services/project.service.js
import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

// Create a project
export const createProject = async ({ name, userId }) => {
    if (!name) throw new Error("Name is required");
    if (!userId) throw new Error("UserId is required");

    const project = await projectModel.create({
        name,
        users: [userId],
        messages: [],
        fileTree: {}
    });

    return project;
};

// Save message inside a project
export const saveMessage = async ({ projectId, sender, message }) => {
    if (!projectId || !sender || !message) {
        throw new Error("projectId, sender and message are required");
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId");
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
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

    if (!updatedProject) {
        throw new Error("Project not found");
    }

    return updatedProject;
};

// Get all messages from a project
export const getMessages = async ({ projectId }) => {
    if (!projectId) throw new Error("projectId is required");

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId");
    }

    const project = await projectModel.findById(projectId);

    return project?.messages || [];
};

// Get all projects for a logged-in user
export const getAllProjectByUserId = async ({ userId }) => {
    if (!userId) throw new Error("UserId is required");

    const projects = await projectModel.find({ users: userId });
    return projects;
};

// Add collaborators to the project
export const addUsersToProject = async ({ projectId, users, userId }) => {
    if (!projectId || !users) throw new Error("projectId and users are required");

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId");
    }

    // Validate user IDs
    for (const u of users) {
        if (!mongoose.Types.ObjectId.isValid(u)) {
            throw new Error("Invalid userId inside users array");
        }
    }

    // Only existing collaborators can add new collaborators
    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    });

    if (!project) {
        throw new Error("You are not authorized to add users to this project");
    }

    const updated = await projectModel.findByIdAndUpdate(
        projectId,
        { $addToSet: { users: { $each: users } } },
        { new: true }
    );

    return updated;
};

// Get a single project
export const getProjectById = async ({ projectId }) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId");
    }

    const project = await projectModel
        .findById(projectId)
        .populate("users");

    return project;
};

// Update file tree saved inside project
export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId");
    }

    const updated = await projectModel.findByIdAndUpdate(
        projectId,
        { fileTree },
        { new: true }
    );

    return updated;
};
