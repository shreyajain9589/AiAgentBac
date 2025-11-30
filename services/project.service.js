// services/project.service.js
import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

/* CREATE PROJECT */
export const createProject = async ({ name, userId }) => {
  return await projectModel.create({
    name,
    users: [userId],
    messages: [],
    fileTree: {},
  });
};

/* SAVE MESSAGE */
export const saveMessage = async ({ projectId, sender, message }) => {
  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid projectId");

  const updated = await projectModel.findByIdAndUpdate(
    projectId,
    {
      $push: {
        messages: {
          sender,
          message,
          createdAt: new Date(),
        },
      },
    },
    { new: true }
  );

  if (!updated) throw new Error("Project not found");
  return updated;
};

/* GET MESSAGES */
export const getMessages = async ({ projectId }) => {
  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid projectId");

  const project = await projectModel.findById(projectId);
  return project?.messages || [];
};

/* GET ALL PROJECTS */
export const getAllProjectByUserId = async ({ userId }) => {
  return await projectModel.find({ users: userId });
};

/* ADD USERS */
export const addUsersToProject = async ({ projectId, users }) => {
  return await projectModel.findByIdAndUpdate(
    projectId,
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );
};

/* REMOVE USER */
export const removeUser = async ({ projectId, userId }) => {
  return await projectModel
    .findByIdAndUpdate(
      projectId,
      { $pull: { users: userId } },
      { new: true }
    )
    .populate("users");
};

/* GET PROJECT BY ID */
export const getProjectById = async ({ projectId }) => {
  return await projectModel.findById(projectId).populate("users");
};

/* UPDATE FILE TREE */
export const updateFileTree = async ({ projectId, fileTree }) => {
  return await projectModel.findByIdAndUpdate(
    projectId,
    { fileTree },
    { new: true }
  );
};
