import { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";

function Profile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [userData,setUserData] = useState({});
  const [loading,setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const [preview, setPreview] = useState();

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("username", username);
      formData.append("bio", bio);

      if (image) {
        formData.append("image", image);
      }

      const data = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.data.success) {

        setPreview(data.data.user.profilePic);
        setImage(null);
        setLoading(false);

        setNotification({
            type: "success",
            message: "Profile updated",
        });

        setTimeout(() => {
          setNotification(null);
        }, 2500);
      }
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };


  useEffect(() => {

    async function checkAuth() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth`,
          {
            withCredentials: true,
          }
        );

        if (!response.data.loggedIn) {
          navigate("/login");
          return;
        }
        else {
          setUserData(response.data.user);
        }

      } catch (err) {
        console.error(err);
     
      }
    }

    checkAuth();
  }, []);

  
  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center items-center p-6">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 w-full max-w-lg rounded-2xl p-8 border border-zinc-800"
        >
        {loading?<h1 className="flex justify-center items-center text-lg text-white">Please wait for a moment</h1>:null}
        <h1 className="flex flex-col text-2xl font-bold text-white mb-8">
          Edit Profile

          <Link to="/" className="text-sm mt-3">
            <ArrowLeft />
          </Link>
        </h1>

        {/* Profile Image */}

        <div className="flex flex-col items-center mb-8">
          <img
            src={preview || userData.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhslR_IBbWqq6aKDwSybRj5I7kZnEI5Rhd_g&s"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-zinc-700"
          />

          <label className="mt-4 cursor-pointer text-blue-400 hover:text-blue-500">
            Change Photo

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />
          </label>
        </div>


        {/* Bio */}

        <h1 className="text-zinc-300 mb-2 block">
            Name:  <span className="text-lg ">{userData.username}</span>
        </h1>

        <div className="mb-8">
          <label className="text-zinc-300 mb-2 block">
            Bio
          </label>

          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell everyone something about yourself..."
            className="w-full bg-zinc-800 rounded-lg px-4 py-3 text-white outline-none resize-none"
          />
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;