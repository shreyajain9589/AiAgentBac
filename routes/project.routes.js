// backend/routes/project.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import * as authMiddleWare from '../middleware/auth.middleware.js';

const router = Router();

// Create project
router.post(
  '/create',
  authMiddleWare.authUser,
  body('name').isString().withMessage('Name is required'),
  projectController.createProject
);

// Get all projects of a user
router.get(
  '/all',
  authMiddleWare.authUser,
  projectController.getAllProject
);

// Add users to project
router.put(
  '/add-user',
  authMiddleWare.authUser,
  body('projectId').isString().withMessage('Project ID is required'),
  body('users')
    .isArray({ min: 1 })
    .withMessage('Users must be an array of strings')
    .custom((users) => users.every((u) => typeof u === 'string'))
    .withMessage('Each user must be a string'),
  projectController.addUserToProject
);

// Get single project
router.get(
  '/get-project/:projectId',
  authMiddleWare.authUser,
  projectController.getProjectById
);

// Update file tree
router.put(
  '/update-file-tree',
  authMiddleWare.authUser,
  body('projectId').isString().withMessage('Project ID is required'),
  body('fileTree').isObject().withMessage('File tree is required'),
  projectController.updateFileTree
);

/* ---------------------------------------------------------
   ⭐ NEW ROUTES FOR CHAT (MESSAGE STORAGE)
----------------------------------------------------------*/

// Save a message to a project
router.post(
  '/message',
  authMiddleWare.authUser,
  body('projectId').isString().withMessage('projectId is required'),
  body('message').isString().withMessage('message is required'),
  projectController.saveMessage
);

// Get all messages for a project
router.get(
  '/messages/:projectId',
  authMiddleWare.authUser,
  projectController.getMessages
);

export default router;
