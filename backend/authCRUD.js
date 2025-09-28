import connectDB from "./db.js";

//register a new user
async function registerUser(userData) {
    const db = await connectDB();

    const exsistingUser = await db.collection("Users").findOne({
        $or: [
            { email: userData.email },
            { username: userData.username }
        ]
    });

    if (exsistingUser) {
        return { error: "User already registered" };
    }

    const result = await db.collection("Users").insertOne({
        ...userData,
        profile: {
            avatar: "",
            bio: "",
            phone: ""
        },
        friends: [],
        requests: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    });


    return result.ops?.[0] || userData;
}

//login if you are registered
async function loginUser(email, password) {
    const db = await connectDB();
    const user = await db.collection("Users").findOne({ email, password });

    if (!user) return null;

    const lastLoginDate = new Date().toISOString();
    await db.collection("Users").updateOne(
        { _id: user._id },
        { $set: { lastLogin: lastLoginDate } }
    );

    const updatedUser = await db.collection("Users").findOne({ _id: user._id });

    return updatedUser;
}

//logout
function logoutUser() {
    return { message: "User logged out" };
}

//Send a friend request
async function sendFriendRequest(senderId, receiverId) {
    const db = await connectDB();

    const sender = await db.collection("Users").findOne({ id: senderId });
    const receiver = await db.collection("Users").findOne({ id: receiverId });

    if (!sender || !receiver) {
        return { error: "Sender or receiver not found" };
    }

    if (receiver.requests.includes(senderId) || receiver.friends.includes(senderId)) {
        return { error: "Already requested or already friends" };
    }

    await db.collection("Users").updateOne(
        { id: receiverId },
        { $push: { requests: senderId } }
    );

    return { message: "Friend request sent" };
}

//Accept a friend
async function acceptFriendRequest(userId, senderId) {
    const db = await connectDB();

    await db.collection("Users").updateOne(
        { id: userId },
        {
            $pull: { requests: senderId },
            $push: { friends: senderId }
        }
    );

    await db.collection("Users").updateOne(
        { id: senderId },
        { $push: { friends: userId } }
    );

    return { message: "Friend request accepted" };
}

//decline a request
async function declineFriendRequest(userId, senderId) {
    const db = await connectDB();

    await db.collection("Users").updateOne(
        { id: userId },
        { $pull: { requests: senderId } }
    );

    return { message: "Friend request declined" };
}

//Get friends
async function getFriends(userId) {
    const db = await connectDB();

    const user = await db.collection("Users").findOne({ id: userId });
    if (!user) return [];

    return db.collection("Users")
        .find({ id: { $in: user.friends || [] } })
        .toArray();
}

//get all requests
async function getFriendRequests(userId) {
    const db = await connectDB();

    const user = await db.collection("Users").findOne({ id: userId });
    if (!user) return [];

    return db.collection("Users")
        .find({ id: { $in: user.requests || [] } })
        .toArray();
}

// Unfriend a user
async function unfriendUser(userId, friendId) {
    const db = await connectDB();

    await db.collection("Users").updateOne(
        { id: userId },
        { $pull: { friends: friendId } }
    );

    await db.collection("Users").updateOne(
        { id: friendId },
        { $pull: { friends: userId } }
    );

    return { message: "Unfriended successfully" };
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
    getFriendRequests,
    unfriendUser
};
