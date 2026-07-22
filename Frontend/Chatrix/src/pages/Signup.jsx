import { useState } from "react";
import {
  MessageCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    username:"",
    email:"",
    password:"",
  });

  const navigate = useNavigate();


  function inputData(e) {
    let {name,value} = e.target;
    setFormData((curr)=> ({
      ...curr,
      [name]:value,
    }))
  }

  function onFormChange(e) {
    e.preventDefault();
    sendDataBackend(formData);
  }


   async function sendDataBackend(data) {

    try {
      let response = await axios.post('http://localhost:8000/api/signup',data,{
        withCredentials:true,
      })
      
      if(response.data.success) {
        navigate('/');
        setFormData({
          username: "",
          email: "",
          password: "",
        })
      }
      else {
        setFormData({
          username: "",
          email: "",
          password: "",
        })
        console.log("failed");
      }
    }
    catch(e) {
      console.log(e.response?.data?.message);
      console.log(e);
    }
  }


  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">


        <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">

          <div className="flex items-center gap-3 mb-8">
            <div className="bg-violet-600 p-3 rounded-2xl">
              <MessageCircle size={32} className="text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white">
              Chatrix
            </h1>
          </div>

          <h2 className="text-5xl font-bold text-white leading-tight">
            Connect.
            <br />
            Chat.
            <br />
            Stay Together.
          </h2>

          <p className="text-zinc-400 text-lg mt-8 leading-8">
            Join thousands of people already chatting with their
            friends in real-time using Chatrix.
          </p>

          <div className="mt-12 space-y-5">

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-zinc-300">
                Instant Messaging
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-zinc-300">
                Secure Conversations
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
              Create Account
            </h2>

            <p className="text-zinc-400 mt-2 mb-8">
              Join Chatrix and start chatting instantly.
            </p>


            {/* form  */}

            <form className="space-y-5" onSubmit={onFormChange}>

              {/* Name */}

              <div className="relative">

                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Full Name"
                  minLength={3}
                  name="username"
                  onChange={inputData}
                  value={formData.username}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 transition"
                />

              </div>

              {/* Email */}

              <div className="relative">

                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  onChange={inputData}
                  value={formData.email}
                  required
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
                  name="password"
                  required
                  minLength={6}
                  onChange={inputData}
                  value={formData.password}
                  placeholder="Password"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {/* Button */}

              <button
                className="w-full bg-violet-600 hover:bg-violet-500 transition rounded-xl py-3 text-white font-semibold"
              >
                Create Account
              </button>

            </form>

            {/* Login */}

            <p className="text-center text-zinc-400 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300 font-medium"
              >
                Login
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;