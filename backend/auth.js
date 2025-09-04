import express from "express";
const router = express.Router();

const dummyUser = {
    id: 1,
    email: "test@example.com",
    name: "John Doe",
    token: "dummy-token",
};

router.post("/signup", (req, res) => {
    const { email, password } = req.body;

    res.status(201).json({
        message: "User signed up successfully",
        user: dummyUser,
    });
});

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        res.json({
            message: "User signed in successfully",
            user: dummyUser,
        });
    } else {
        res.status(400).json({ message: "Missing email or password" });
    }
});

module.exports = router;
