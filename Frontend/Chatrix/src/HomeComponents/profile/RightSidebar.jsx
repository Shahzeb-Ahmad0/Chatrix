import {
  ArrowLeft,
  Bell,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

function RightSidebar({ user, setActiveView ,onlineUsers}) {
  const isOnline = onlineUsers?.includes(user._id);
  return (
    <aside className="flex h-full w-full flex-col border-l border-zinc-800 bg-zinc-900">

      {/* Header */}

      <div className="flex items-center gap-3 border-b border-zinc-800 p-4">

        {/* Mobile Back */}

        <button
          onClick={() => setActiveView?.("chat")}
          className="rounded-lg p-2 hover:bg-zinc-800 md:hidden"
        >
          <ArrowLeft
            size={20}
            className="text-white"
          />
        </button>

        <h2 className="text-lg font-semibold text-white">
          Profile
        </h2>

      </div>

      {/* Profile */}

      <div className="flex flex-col items-center p-8">

        <Avatar className="h-28 w-28">
          <AvatarImage src={user.profilePic} />
          <AvatarFallback>
            {user.username[0]}
          </AvatarFallback>
        </Avatar>

        <h3 className="mt-4 text-xl font-semibold text-white">
          {user.username}
        </h3>

        <p
          className={`mt-2 text-sm ${
            isOnline
              ? "text-green-400"
              : "text-zinc-500"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </p>

      </div>

      {/* Information */}

      <div className="space-y-6 px-6">

        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
            About
          </p>

          <p className="text-zinc-300">
            {user.bio || "Hey there! 👋 I'm using Chatrix."}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <Mail
            size={18}
            className="text-zinc-400"
          />

          <span className="text-zinc-300">
            {user.email}
          </span>

        </div>

      </div>

      {/* Spacer */}

      <div className="flex-1" />

      {/* Actions */}

      <div className="space-y-3 p-6">

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-white transition hover:bg-zinc-700">

          <Bell size={18} />

          Notifications

        </button>

      </div>

    </aside>
  );
}

export default RightSidebar;