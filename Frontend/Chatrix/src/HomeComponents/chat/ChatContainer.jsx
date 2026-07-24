import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import axios from "axios";
import socket from "../../socket/socket.js";


function ChatContainer({
  user,
  setActiveView,
  showProfile,
  setShowProfile,
  currentUser,
  onlineUsers
}) {
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  // Load messages whenever the selected user changes
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getmessages/${user._id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (user?._id) {
      fetchMessages();
    }
  }, [user]);


  useEffect(() => {
    function handleNewMessage(newMessage) {
      if (
        newMessage.senderId === user._id ||
        newMessage.receiverId === user._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [user]);


  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(text) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/sendmessage/${user._id}`,
        {
          text,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          response.data.newMessage,
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-zinc-950">

      <ChatHeader
        user={user}
        setActiveView={setActiveView}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        onlineUsers={onlineUsers}
      />

      {/* Messages */}

      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-6">

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">

          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              myId={currentUser?._id}
            />
          ))}

          <div ref={bottomRef} />

        </div>

      </div>

      {/* Input */}

      <MessageInput onSend={sendMessage} />

    </div>
  );
}

export default ChatContainer;