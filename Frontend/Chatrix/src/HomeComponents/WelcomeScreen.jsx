import { MessageCircleMore } from "lucide-react";

function WelcomeScreen() {
  return (
    <div className="flex h-full flex-1 items-center justify-center bg-zinc-950">

      <div className="max-w-md px-6 text-center">

        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600/20">

          <MessageCircleMore
            size={48}
            className="text-indigo-500"
          />

        </div>

        <h1 className="text-4xl font-bold text-white">
          Welcome to Chatrix
        </h1>

        <p className="mt-4 text-zinc-400">
          Select a conversation from the sidebar to start chatting with your friends.
        </p>

        <div className="mt-8 flex justify-center gap-3">

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
            ⚡ Fast
          </span>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
            🔒 Secure
          </span>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
            💬 Real-time
          </span>

        </div>

      </div>

    </div>
  );
}

export default WelcomeScreen;