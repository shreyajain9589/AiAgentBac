import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleWare from "../middleware/auth.middleware.js";

const router = Router();

// Create project
router.post(
  "/create",
  authMiddleWare.authUser,
  body("name").isString().withMessage("Name is required"),
  projectController.createProject
);

// Get all projects of logged in user
router.get(
  "/all",
  authMiddleWare.authUser,
  projectController.getAllProject
);

// Add collaborators
router.put(
  "/add-user",
  authMiddleWare.authUser,
  body("projectId").isString(),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array")
    .custom((users) => users.every((u) => typeof u === "string"))
    .withMessage("User IDs must be strings"),
  projectController.addUserToProject
);

// Get a single project by ID
router.get(
  "/get-project/:projectId",
  authMiddleWare.authUser,
  projectController.getProjectById
);

// Update file tree
router.put(
  "/update-file-tree",
  authMiddleWare.authUser,
  body("projectId").isString(),
  body("fileTree").isObject(),
  projectController.updateFileTree
);

/* --------------------------
    ⭐ NEW CHAT ROUTES
--------------------------- */

// Save message sent by user
router.post(
  "/message",
  authMiddleWare.authUser,
  body("projectId").isString(),
  body("message").isString(),
  projectController.saveMessageController
);

// Get all messages for a project
router.get(
  "/messages/:projectId",
  authMiddleWare.authUser,
  projectController.getMessages
);

// ⛔ IMPORTANT — DEFAULT EXPORT
export default router;
