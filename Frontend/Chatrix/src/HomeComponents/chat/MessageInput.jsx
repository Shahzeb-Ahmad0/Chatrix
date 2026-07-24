import { useState } from "react";
import {
  Paperclip,
  SendHorizontal,
  Smile,
} from "lucide-react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  function handleSend() {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-900 p-3">

      <div className="flex items-center gap-2">



        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
        />

        <button
          onClick={handleSend}
          className="rounded-xl bg-indigo-600 p-3 transition hover:bg-indigo-700"
        >
          <SendHorizontal
            size={20}
            className="text-white"
          />
        </button>

      </div>

    </div>
  );
}

export default MessageInput;