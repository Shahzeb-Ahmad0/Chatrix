import { CheckCircle2, XCircle } from "lucide-react";

function Notification({ type, message }) {
  const success = type === "success"; 

  return (
    <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2">

      <div
        className={`flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg transition-all
          ${
            success
              ? "border-teal-200 bg-teal-50 text-teal-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
      >
        {success ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}

        <p className="text-sm font-medium">
          {message}
        </p>
      </div>

    </div>
  );
}

export default Notification;