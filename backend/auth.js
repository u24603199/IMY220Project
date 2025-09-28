import express from "express";
const router = express.Router();
import authCRUD from "./authCRUD.js";

router.post("/signup", async (req, res) => {
    try {
        const result = await authCRUD.registerUser(req.body);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        res.status(201).json({
            message: "User registered successfully",
            user: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authCRUD.loginUser(email, password);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "User logged in successfully",
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/logout", (req, res) => {
    const result = authCRUD.logoutUser();
    res.json(result);
});

router.post("/friend-request", async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const result = await authCRUD.sendFriendRequest(senderId, receiverId);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/friend-accept", async (req, res) => {
    try {
        const { userId, senderId } = req.body;
        const result = await authCRUD.acceptFriendRequest(userId, senderId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/friend-decline", async (req, res) => {
    try {
        const { userId, senderId } = req.body;
        const result = await authCRUD.declineFriendRequest(userId, senderId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.get("/:userId/friends", async (req, res) => {
    try {
        const friends = await authCRUD.getFriends(parseInt(req.params.userId));
        res.json(friends);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.get("/:userId/requests", async (req, res) => {
    try {
        const requests = await authCRUD.getFriendRequests(parseInt(req.params.userId));
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/unfriend", async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        const result = await authCRUD.unfriendUser(userId, friendId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
