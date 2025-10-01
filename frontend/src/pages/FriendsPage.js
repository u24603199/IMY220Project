import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";

export default function FriendsPage() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = Number(storedUser?.id);

    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!currentUserId) {
            console.error("currentUserId is null or undefined!");
            return;
        }

        //console.log("Fetching data for user:", currentUserId);

        fetch(`/api/auth/${currentUserId}/requests`)
            .then(res => res.json())
            .then(data => {
                //console.log("Requests data:", data);
                setRequests(data);
            })
            .catch(err => {
                console.error("Error fetching requests:", err);
                setError("Failed to load friend requests");
            });

        fetch(`/api/auth/${currentUserId}/friends`)
            .then(res => res.json())
            .then(data => {
                //console.log("Friends data:", data);
                setFriends(data);
            })
            .catch(err => {
                console.error("Error fetching friends:", err);
                setError("Failed to load friends");
            });
    }, [currentUserId]);

    const acceptRequest = async (senderId) => {
        try {
            const response = await fetch(`/api/auth/friend/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    senderId,
                }),
            });

            if (!response.ok) throw new Error("Failed to accept request");

            setRequests((prev) => prev.filter(r => r.senderId !== senderId));
            const newFriend = await response.json();
            setFriends((prev) => [...prev, newFriend]);
        } catch (err) {
            alert("Could not accept friend request");
        }
    };

    const declineRequest = async (senderId) => {
        try {
            const response = await fetch(`/api/auth/friend/decline`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    senderId,
                }),
            });

            if (!response.ok) throw new Error("Failed to decline request");

            setRequests((prev) => prev.filter(r => r.senderId !== senderId));
        } catch (err) {
            alert("Could not decline friend request");
        }
    };

    const unfriend = async (friendId) => {
        try {
            const response = await fetch("/api/auth/unfriend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    friendId: friendId,
                }),
            });

            if (!response.ok) throw new Error("Failed to unfriend");

            const result = await response.json();
            //console.log("Successfully unfriended:", result);
            setFriends((prev) => prev.filter((f) => f.id !== friendId));  // Remove from the list
        } catch (err) {
            alert("Could not unfriend");
        }
    };

    return (
        <>
            <link rel="stylesheet" href="/assets/FriendsPage.css" />
            <Sidebar>
                <div className="friends-page">
                    <div className="friend-section friend-requests">
                        <h2>Friend Requests</h2>
                        {requests.length > 0 ? (
                            requests.map((req, idx) => (
                                <div key={idx} className="friend-tile">
                                    <p><strong>{req.senderUsername}</strong></p>
                                    <button onClick={() => acceptRequest(req.senderId)}>Accept</button>
                                    <button onClick={() => declineRequest(req.senderId)}>Decline</button>
                                </div>
                            ))
                        ) : (
                            <p>No friend requests</p>
                        )}
                    </div>

                    <div className="friend-section current-friends">
                        <h2>Your Friends</h2>
                        {friends.length > 0 ? (
                            friends.map((friend, idx) => (
                                <div key={idx} className="friend-tile">
                                    <p>{friend.username}</p>
                                    <button className="unfriend-btn" onClick={() => {
                                        //console.log("Unfriend clicked for friend ID:", friend.id);
                                        unfriend(friend.id);
                                    }}>
                                        <span role="img" aria-label="unfriend">❌</span> Unfriend
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>You have no friends yet</p>
                        )}
                    </div>

                    {error && <p className="error-message">{error}</p>}
                </div>
            </Sidebar>
        </>

    );
}
