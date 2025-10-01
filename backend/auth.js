import express from "express";
const router = express.Router();
import authCRUD from "./authCRUD.js";
const multer = require("multer");
const path = require("path");

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

router.post("/friend/request", async (req, res) => {
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

router.post("/friend/accept", async (req, res) => {
    try {
        const { userId, senderId } = req.body;
        const result = await authCRUD.acceptFriendRequest(userId, senderId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/friend/decline", async (req, res) => {
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
        const userId = req.params.userId;

        const user = await authCRUD.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const populatedRequests = await Promise.all(user.requests.map(async (requestId) => {
            const sender = await authCRUD.getUserById(requestId);
            return {
                senderId: sender.id,
                senderUsername: sender.username,
                senderProfile: sender.profile
            };
        }));

        res.json(populatedRequests);
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).json({ message: "Server error" });
    }
});




router.post("/unfriend", async (req, res) => {
    //console.log("Unfriend route hit"); 

    try {
        const { userId, friendId } = req.body;
        const result = await authCRUD.unfriendUser(userId, friendId);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        res.json(result);
    } catch (error) {
        console.error("Error in unfriend route:", error);
        res.status(500).send("Server error");
    }
});



router.get("/users", async (req, res) => {
    try {
        const users = await authCRUD.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).send("Server error");
    }
});

router.put("/:id/updateProfile", async (req, res) => {
    try {
        const userId = req.params.id;
        const { phone, email, dob, bio } = req.body;

        const updatedUser = await authCRUD.updateUserProfile(userId, { phone, email, dob, bio });

        if (!updatedUser) return res.status(404).send("User not found");

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).send("Server error");
    }
});


//Image upload

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const saveDir = path.resolve(__dirname, "../../frontend/public/assets/images/Avatars");
        cb(null, saveDir);
    },
    filename: (req, file, cb) => {
        cb(null, `profile-${Date.now()}-${Math.floor(Math.random() * 10000)}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/:id/uploadProfilePic", upload.single("image"), async (req, res) => {
    try {
        const userId = req.params.id;
        const imageUrl = `/assets/images/Avatars/${req.file.filename}`;

        const updatedUser = await authCRUD.updateUserProfilePic(userId, imageUrl);

        if (!updatedUser) return res.status(404).send("User not found");

        res.json({ imageUrl });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).send("Server error");
    }
});

//Get user By ID
router.get("/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await authCRUD.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Server error");
    }
});




module.exports = router;
