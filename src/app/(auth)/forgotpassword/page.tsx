"use client";
import { changePassword } from "@/redux/fetures/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-react";

type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  show: boolean;
  onChange: (v: string) => void;
  onToggle: () => void;
  autoComplete: string;
};

const PasswordField = ({
  label,
  placeholder,
  value,
  show,
  onChange,
  onToggle,
  autoComplete,
}: FieldProps) => (
  <div>
    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <div className="relative">
      <Lock
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-indigo-50/60 py-3.5 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-indigo-600"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const tips = [
  "At least 8 characters long",
  "Mix letters, numbers & symbols",
  "Never reuse an old password",
];

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await dispatch(
        changePassword({ oldPassword, newPassword })
      ).unwrap();

      toast.success(res);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-900/10 md:grid-cols-2"
      >
        {/* Left brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-indigo-700 p-10 text-white md:flex">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[48px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-500/40" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-700">
              <ShieldCheck size={22} />
            </div>
            <span className="text-lg font-semibold">YourStore</span>
          </div>

          <div className="relative">
            <h1 className="text-3xl font-extrabold leading-tight">
              Keep your account safe.
            </h1>
            <p className="mt-3 max-w-xs text-indigo-100">
              Update your password regularly to protect your orders, cart and
              saved details.
            </p>

            <ul className="mt-8 space-y-3">
              {tips.map((tip) => (
                <li key={tip} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 size={18} className="text-amber-400" />
                  <span className="text-indigo-50">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right form panel */}
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Change password
          </h2>
          <p className="mt-1 text-slate-500">
            Enter your current password and choose a new one.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <PasswordField
              label="Old password"
              placeholder="Enter old password"
              value={oldPassword}
              show={showOld}
              onChange={setOldPassword}
              onToggle={() => setShowOld((s) => !s)}
              autoComplete="current-password"
            />

            <PasswordField
              label="New password"
              placeholder="Enter new password"
              value={newPassword}
              show={showNew}
              onChange={setNewPassword}
              onToggle={() => setShowNew((s) => !s)}
              autoComplete="new-password"
            />

            <PasswordField
              label="Confirm new password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              show={showConfirm}
              onChange={setConfirmPassword}
              onToggle={() => setShowConfirm((s) => !s)}
              autoComplete="new-password"
            />

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 py-3.5 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Updating..."
              ) : (
                <>
                  Change password <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;