import express from 'express';
const router = express.Router();
import { getAllContacts,getMessagesByUserId,sendMessage,getChatPartners } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
router.get("/send", (req, res) => {
  res.send('Send Message endpoint');
});

router.get("/contacts", protectRoute, getAllContacts);
router.get("/chats",protectRoute, getChatPartners);
 router.get("/:id", protectRoute,getMessagesByUserId);
 router.post("/send/:id",protectRoute,sendMessage);

export default router;