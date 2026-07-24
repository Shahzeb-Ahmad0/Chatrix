import { useState, useEffect } from "react";
import Sidebar from "../HomeComponents/sidebar/Sidebar";
import ChatContainer from "../HomeComponents/chat/ChatContainer";
import RightSidebar from "../HomeComponents/profile/RightSidebar";
import WelcomeScreen from "../HomeComponents/WelcomeScreen";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket.js";

function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Mobile navigation
  const [activeView, setActiveView] = useState("sidebar");

  // Tablet drawer
  const [showProfile, setShowProfile] = useState(false);

  // Online users received from Socket.IO
  const [onlineUsers, setOnlineUsers] = useState([]);

  const navigate = useNavigate();

  const handleSelectUser = (user) => {
    setSelectedUser(user);

    if (window.innerWidth < 768) {
      setActiveView("chat");
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth`,
          {
            withCredentials: true,
          }
        );

        if (!isMounted) return;

        if (!response.data.loggedIn) {
          navigate("/login");
          return;
        }

        const user = response.data.user;
        setCurrentUser(user);


        
        if (!socket.connected) {
          socket.io.opts.query = { userId: user._id };
          socket.connect();
        }

        socket.emit("requestOnlineUsers");

      } catch (err) {
        console.error(err);
     
      }
    }

      socket.on("getOnlineUsers", (users) => {
          console.log("Online Users:", users);
          if (isMounted) {
            setOnlineUsers(users);
          }
      });

    checkAuth();

    return () => {
      isMounted = false;
      socket.off("getOnlineUsers");
    };
  }, [navigate]);

  return (
    <div className="h-[100dvh] bg-zinc-950">

      {/* ---------------- Desktop ---------------- */}

      <div className="hidden lg:grid h-full grid-cols-[320px_1fr_340px]">

        <Sidebar
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          onlineUsers={onlineUsers}
        />

        {selectedUser ? (
          <ChatContainer
            user={selectedUser}
            onlineUsers={onlineUsers}
            currentUser={currentUser}
          />
        ) : (
          <WelcomeScreen />
        )}

        {selectedUser ? (
          <RightSidebar
            user={selectedUser}
            onlineUsers={onlineUsers}
          />
        ) : (
          <div className="border-l border-zinc-800 bg-zinc-900" />
        )}
        
      </div>

      {/* ---------------- Tablet ---------------- */}

      <div className="hidden md:grid lg:hidden h-full grid-cols-[280px_1fr]">

        <Sidebar
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          onlineUsers={onlineUsers}
        />

        {selectedUser ? (
          <ChatContainer
            user={selectedUser}
            currUser={currentUser}
            showProfile={showProfile}
            setShowProfile={setShowProfile}
            onlineUsers={onlineUsers}
          />
        ) : (
          <WelcomeScreen />
        )}

        {/* Drawer */}

        <div
          className={`fixed inset-0 z-50 transition ${
            showProfile
              ? "pointer-events-auto"
              : "pointer-events-none"
          }`}
        >
          <div
            onClick={() => setShowProfile(false)}
            className={`absolute inset-0 bg-black/40 transition-opacity ${
              showProfile
                ? "opacity-100"
                : "opacity-0"
            }`}
          />

          <div
            className={`absolute right-0 top-0 h-full w-[340px] bg-zinc-900 transition-transform duration-300 ${
              showProfile
                ? "translate-x-0"
                : "translate-x-full"
            }`}
          >
            {selectedUser && (
              <RightSidebar
                user={selectedUser}
                onlineUsers={onlineUsers}
              />
            )}
          </div>
        </div>

      </div>

      {/* ---------------- Mobile ---------------- */}

      <div className="flex h-full md:hidden">

        {activeView === "sidebar" && (
          <Sidebar
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            onlineUsers={onlineUsers}
          />
        )}

        {activeView === "chat" && selectedUser && (
          <ChatContainer
            currentUser={currentUser}
            user={selectedUser}
            setActiveView={setActiveView}
            onlineUsers={onlineUsers}
          />
        )}

        {activeView === "profile" && selectedUser && (
          <RightSidebar
            user={selectedUser}
            setActiveView={setActiveView}
            onlineUsers={onlineUsers}
          />
        )}

      </div>

    </div>
  );
}

export default Home;