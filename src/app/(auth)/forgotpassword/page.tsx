"use client";
import { changePassword } from "@/redux/fetures/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await dispatch(
        changePassword({ oldPassword, newPassword })
      ).unwrap();

      toast.success(res);
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Change Password 🔐
          </h2>

          <div className="space-y-5">

            {/* Old Password */}
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white transition"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white transition"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Change Password"}
            </motion.button>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;