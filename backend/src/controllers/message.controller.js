import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;
    //return  data exept clerkID for all users except the logged in user
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-clerkId");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getConversationsForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const conversations = await Message.aggregate([
      //1.keep only messages where the logged in user is either the sender or receiver
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        },
      },

      //2.collapse them into one row per chat partner,noting our latest message time.
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", loggedInUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      //3.Put the most recent conversation at the top
      { $sort: { lastMessageAt: -1 } },
      //4.Look up each partner's user profile(comes back as an array).
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      //5.Pull that profile out of the array and make it the document.
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      //6.Remove the clerkId field from the user profile.
      { $project: { clerkId: 0 } },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations for sidebar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendMessages(req, res) {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    let videoUrl = null;

    if (req.file) {
      if (!hasImageKitConfig()) {
        return res
          .status(500)
          .json({ message: "Media configuration is missing" });
      }
      const url = await uploadToImageKit(req.file);
      if (req.file.mimetype.startsWith("image/")) {
        imageUrl = url;
      } else if (req.file.mimetype.startsWith("video/")) {
        videoUrl = url;
      }
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    //only send the message in real time to the receiver if they are online
    if (receiverSocketId) {
      server.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
