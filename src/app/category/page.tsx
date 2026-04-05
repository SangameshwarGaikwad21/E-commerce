"use client";
import { useRouter } from "next/navigation";
import { Smartphone, Laptop, ShoppingBag, Shirt } from "lucide-react";

const Category = () => {
  const router = useRouter();

  const categories = [
    { _id: "1", name: "Mobile", slug: "electronics", icon: Smartphone },
    { _id: "2", name: "Laptop", slug: "clothing", icon: Laptop },
    { _id: "3", name: "Shoes", slug: "shoes", icon: ShoppingBag },
    { _id: "4", name: "Dress", slug: "accessories", icon: Shirt },
  ];

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <div
              key={cat._id}
              onClick={() => router.push(`/category/${cat.slug}`)}
              className="group cursor-pointer p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl transition duration-300 shadow-md hover:shadow-xl hover:scale-105"
            >
              <div className="mb-4">
                <Icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition" />
              </div>

              <h3 className="text-lg font-semibold group-hover:text-blue-300 transition">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Explore products →
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;