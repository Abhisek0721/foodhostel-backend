import express from "express";
import ContactController from "../controllers/ContactController";
const router = express.Router();

router.route("/sendMessage").post(ContactController.sendMessage);

export default router;
