/* eslint-disable react/prop-types */
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const ProfileSettings = ({ onClose, currentUser }) => {
  const [username, setUsername] = useState(currentUser?.username || "");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!username || username.length < 4 || username.length > 20 ) {
      toast.error("Username must be at least 4-20 characters long");
      return;
    }
    if (!profileImage) {
      toast.error("Please select a profile image");
      return;
    }
    // Add your save logic here
    console.log("Saving profile...", { username, profileImage });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#121212] text-white overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="hover:bg-gray-800 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold">Edit Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-10 p-6">
        <h2 className="text-xl font-medium mb-8">Profile Setting</h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Profile Image</h3>
          <div className="flex items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 overflow-hidden">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*,.gif"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="absolute inset-0 cursor-pointer"
              />
            </div>
            <div className="text-gray-400">
              <p>We recommend an image of at least 300x300.</p>
              <p>GIFs work too.</p>
              <p>Max 5mb.</p>
            </div>
          </div>
        </div>

        {/* Username Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Username</h3>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-900 rounded-lg p-3 border border-gray-800 focus:outline-none focus:border-purple-500"
            placeholder="Enter username"
          />
          <p className="mt-2 text-sm text-gray-400">
            Changes allowed every 6 months; must be 4+ characters with letters,
            numbers, or underscores, and not taken
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-4 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
