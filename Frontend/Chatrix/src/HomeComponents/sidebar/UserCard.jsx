import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserCard({
  user,
  selectedUser,
  onSelectUser,
  unseenMessages,
  onlineUsers
}) {
  const isActive = selectedUser?._id === user._id;
  const isOnline = onlineUsers.includes(user._id);

  return (
    <button
      onClick={() => onSelectUser(user)}
      className={`w-full rounded-xl p-3 transition-all duration-200 ${
        isActive ? "bg-indigo-600" : "hover:bg-zinc-800"
      }`}
    >
      <div className="flex items-center gap-3">

        <div className="relative shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profilePic} />
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

           {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 bg-green-500" />
            )}
        </div>

        <div className="min-w-0 flex-1 text-left">

          <div className="flex items-center justify-between">

            <h3 className="truncate font-medium text-white">
              {user.username}
            </h3>

          </div>

          <div className="mt-1 flex items-center justify-between">

            <p className="truncate text-sm text-zinc-400">
              {user.bio || "No bio available"}
            </p>

            {(unseenMessages[user._id] || 0) > 0 && (
              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-xs font-medium text-white">
                {unseenMessages[user._id]}
              </span>
            )}

          </div>

        </div>

      </div>
    </button>
  );
}

export default UserCard;