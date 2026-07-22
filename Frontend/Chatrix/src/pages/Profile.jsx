import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Profile({ user, setUser }) {
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(
    user?.profilePic ||
      "https://ui-avatars.com/api/?background=18181b&color=fff"
  );

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("username", username);
      formData.append("bio", bio);

      if (image) {
        formData.append("image", image);
      }

      const data = await axios.put(
        "http://localhost:8000/api/profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.data.success) {
        setUser(data.data.user);

        setPreview(data.user.profilePic);
        setImage(null);

        alert("Profile Updated");
      }
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 w-full max-w-lg rounded-2xl p-8 border border-zinc-800"
      >
        <h1 className="flex flex-col text-2xl font-bold text-white mb-8">
          Edit Profile

          <Link to="/" className="text-sm mt-3">
            <ArrowLeft />
          </Link>
        </h1>

        {/* Profile Image */}

        <div className="flex flex-col items-center mb-8">
          <img
            src={preview}
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