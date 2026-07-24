function MessageBubble({ message, myId }) {
  const isMe = message.senderId === myId;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });


  return (
    <div
      className={`flex ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isMe
            ? "rounded-br-md bg-indigo-600 text-white"
            : "rounded-bl-md bg-zinc-800 text-white"
        }`}
      >
        <p className="break-words text-sm leading-relaxed">
          {message.text}
        </p>

        <p className="mt-1 text-right text-[11px] text-zinc-300">
          {time}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;