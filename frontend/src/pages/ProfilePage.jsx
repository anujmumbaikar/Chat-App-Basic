import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
  });

  // Update formData when authUser changes
  useEffect(() => {
    setFormData({
      fullName: authUser?.fullName || "",
      email: authUser?.email || "",
    });
  }, [authUser]);

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.readAsDataURL(file);

  //   reader.onload = async () => {
  //     const base64Image = reader.result;
  //     setSelectedImg(base64Image);
  //     await updateProfile({avatar: base64Image });
  //   };
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                {/* <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                /> */}
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Editable form section */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                placeholder="Enter your email address"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 bg-primary text-white rounded-lg ${
                isUpdatingProfile ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? "Updating..." : "Save Changes"}
            </button>
          </form>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;