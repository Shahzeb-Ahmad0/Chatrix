import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

function ChatHeader({
  user,
  setActiveView,
  setShowProfile,
  onlineUsers
}) {

  const isOnline = onlineUsers.includes(user._id);
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">

      <div className="flex items-center gap-3">

        {/* Mobile Back Button */}
        <button
          onClick={() => setActiveView?.("sidebar")}
          className="rounded-lg p-2 hover:bg-zinc-800 md:hidden"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profilePic} />
          <AvatarFallback>
            {user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold text-white">
            {user.username}
          </h2>

          <p className="text-sm text-green-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">

        <button
          onClick={() => {
            if (window.innerWidth >= 768 && window.innerWidth < 1024) {
              setShowProfile?.(true);
            } else {
              setActiveView?.("profile");
            }
          }}
          className="rounded-lg p-2 transition hover:bg-zinc-800"
        >
          <MoreVertical
            size={20}
            className="text-zinc-300"
          />
        </button>

      </div>
    </header>
  );
}

export default ChatHeader;