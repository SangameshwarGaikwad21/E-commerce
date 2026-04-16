"use client"
import { motion } from "framer-motion";
import { FaBox, FaUsers, FaShoppingCart } from "react-icons/fa";

function page() {
  const stats = [
    {
      title: "Total Products",
      value: 0,
      icon: <FaBox />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Total Users",
      value: 0,
      icon: <FaUsers />,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Total Orders",
      value: 0,
      icon: <FaShoppingCart />,
      color: "from-pink-400 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.08 }}
            className={`bg-gradient-to-r ${item.color} p-[2px] rounded-2xl`}
          >

            <div className="bg-black rounded-2xl p-6 text-center shadow-xl">
              
              <div className="text-4xl text-white mb-3">
                {item.icon}
              </div>

              <h2 className="text-3xl font-bold text-white">
                {item.value}
              </h2>

              <p className="text-gray-400 mt-2">
                {item.title}
              </p>

            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-white">
        Recent Product.        
      </div>
    </div>
  );
}

export default page;