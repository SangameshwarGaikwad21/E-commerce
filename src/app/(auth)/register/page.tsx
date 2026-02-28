"use client"
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast";
import { registerUser } from "@/redux/fetures/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const page = () => {

  const router = useRouter(); 

  const dispatch=useDispatch<AppDispatch>();

  const {loading,error}=useSelector((state:RootState)=>state.auth)

  const[showPassword,setShowPassword]=useState(false)
  const [form,setForm]=useState({
    username:"",
    email:"",
    password:""
  })

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
      setForm({
        ...form,
        [e.target.name]:e.target.value
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    try {
      await dispatch(registerUser(form)).unwrap();
      toast.success("User Registered Successfully ✅");
      setForm({
        username: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);

    }  catch (err: any) {
      toast.error(err || "Registration Failed ❌");
    }
  };


  return (
   <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-white">
              Create Account
            </CardTitle>
            <p className="text-center text-gray-400 text-sm">
              Join us and start shopping today 🚀
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <Label className="text-gray-300">Name</Label>
                <Input
                  name="username"
                  placeholder="Enter your name"
                  value={form.username}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 relative">
                <Label className="text-gray-300">Password</Label>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white pr-10 focus:ring-2 focus:ring-blue-500"
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-white transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md"
                >
                  {error}
                </motion.p>
              )}
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold rounded-xl h-11"
                >
                  {loading ? "Creating Account..." : "Register"}
                </Button>
              </motion.div>

              <div className="text-center mt-4 text-sm text-gray-400">
                      Already have an account?{" "}
                  <Link href="/login"
                  className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-300 underline-offset-4 hover:underline"
                > Login
              </Link>
              </div>
              
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default page