import { CheckCircle2, XCircle } from "lucide-react";

function Notification({ type, message }) {
  const success = type === "success";

  return (
    <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center">
      <div
        className={`flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all
        ${
          success
            ? "border-zinc-600 bg-zinc-700 text-white"
            : "border-red-300 bg-red-50 text-red-700"
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {success ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
        </div>

        <p className="flex-1 break-words text-sm font-medium leading-5">
          {message}
        </p>
      </div>
    </div>
  );
}

export default Notification;