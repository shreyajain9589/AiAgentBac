// controllers/project.controller.js
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const project = await projectService.createProject({
            name,
            userId: loggedInUser._id
        });

        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllProject = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const projects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        });

        res.status(200).json({ projects });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { projectId, users } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        });

        res.status(200).json({ project });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await projectService.getProjectById({ projectId });

        res.status(200).json({ project });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ⭐ NEW ROUTE: GET ALL MESSAGES
export const getMessages = async (req, res) => {
    try {
        const { projectId } = req.params;

        const messages = await projectService.getMessages({ projectId });

        res.status(200).json({ messages });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ⭐ NEW ROUTE: SAVE MESSAGE (Frontend POST)
export const saveMessageController = async (req, res) => {
    try {
        const { projectId, sender, message } = req.body;

        const updatedProject = await projectService.saveMessage({
            projectId,
            sender,
            message
        });

        const savedMessage = updatedProject.messages[updatedProject.messages.length - 1];

        res.status(201).json({ message: savedMessage });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        });

        res.status(200).json({ project });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
