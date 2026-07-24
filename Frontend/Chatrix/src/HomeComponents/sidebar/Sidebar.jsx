import { useMemo, useState, useEffect } from "react";
import { MessageCircleMore, Search, LogOut ,MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserCard from "./UserCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Sidebar({ selectedUser, onSelectUser, onlineUsers }) {
  const [users, setUsers] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  async function loggedOut() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setUsers(response.data.users);
          setUnseenMessages(response.data.unseenMessages);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchUsers();
  }, []);

  return (
    <aside className="flex h-full w-full flex-col border-r border-zinc-800 bg-zinc-900">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">

        <div className="flex items-center gap-2">
          <MessageCircleMore className="h-7 w-7 text-indigo-500" />
          <h1 className="text-xl font-bold text-white">
            Chatrix
          </h1>
        </div>


  

        <div className="flex gap-2">
           <div className="relative mt-2">
              <button onClick={() => setOpen(!open)}>
                <MoreVertical size={20} className="text-zinc-300" />
              </button>

              {/* Dropdown here */}
              {open && (
                <div className="absolute right-0 top-12 w-40 rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg overflow-hidden z-50">
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-800"
                    to={'/profile'}
                  >
                    View Profile
                  </Link>

                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-800"
                    onClick={loggedOut}
                  >
                    LogOut
                  </button>
                </div>
              )}
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

          <Input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
          />

        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">

        <div className="space-y-2">

          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              selectedUser={selectedUser}
              onSelectUser={onSelectUser}
              unseenMessages={unseenMessages}
              onlineUsers={onlineUsers}
            />
          ))}

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;