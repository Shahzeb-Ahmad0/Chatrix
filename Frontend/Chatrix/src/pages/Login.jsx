import { useState } from "react";
import {
  MessageCircle,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    sendDataBackend(formData);
  }

  async function sendDataBackend(data) {

    try {
      let response = await axios.post('http://localhost:8000/api/login',data,{
        withCredentials:true,
      })

      if(response.data.success) {
        setFormData({
          username: "",
          password: "",
        })

        setNotification({
            type: "success",
            message: "Login Successfull.",
        });

        setTimeout(() => {
          navigate('/');
        }, 2000);


      }
      else {
        setNotification({
          type: "error",
          message: "Invalid username or password",
        });

        setTimeout(() => {
          setNotification(null);
        }, 2500);
        console.log("login failed");
      }
    }
    catch(e) {
      console.log(e.response?.data?.message);
      console.log(e);
    }
  }

  return (
    <>

    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-8">
           {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
        />
      )}
    

      <div className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">

        {/* ---------------- Left Section ---------------- */}

        <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">

          <div className="flex items-center gap-3 mb-8">

            <div className="bg-violet-600 p-3 rounded-2xl">
              <MessageCircle className="text-white" size={32} />
            </div>

            <h1 className="text-4xl font-bold text-white">
              Chatrix
            </h1>

          </div>

          <h2 className="text-5xl font-bold text-white leading-tight">
            Welcome
            <br />
            Back.
          </h2>

          <p className="text-zinc-400 text-lg mt-8 leading-8">
            Sign in to continue your conversations and stay connected
            with your friends anytime, anywhere.
          </p>

          <div className="mt-12 space-y-5">

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-zinc-300">
                Real-time Messaging
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-zinc-300">
                Secure Authentication
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-zinc-300">
                Responsive Experience
              </span>
            </div>

          </div>

        </div>

        {/* ---------------- Right Section ---------------- */}

        <div className="flex items-center justify-center p-6 sm:p-10">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <MessageCircle className="text-violet-500" size={32} />
              <h1 className="text-3xl font-bold text-white">
                Chatrix
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="text-zinc-400 mt-2 mb-8">
              Login to continue chatting.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}

              <div className="relative">

                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="username"
                  name="username"
                  required
                  onChange={handleChange}
                  value={formData.username}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 transition"
                />

              </div>

              {/* Password */}

              <div className="relative">

                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {/* Remember & Forgot */}

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">

                  <input
                    type="checkbox"
                    className="accent-violet-600"
                  />

                  Remember me

                </label>

                <Link
                  to="/login"
                  className="text-sm text-violet-400 hover:text-violet-300"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* Login Button */}

              <button
                className="w-full bg-violet-600 hover:bg-violet-500 transition rounded-xl py-3 text-white font-semibold"
              >
                Login
              </button>

            </form>

            {/* Signup */}

            <p className="text-center text-zinc-400 mt-8">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-violet-400 hover:text-violet-300 font-medium"
              >
                Create Account
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
    </>
  );
}

export default Login;