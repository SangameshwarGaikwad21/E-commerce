"use client"
import { useRouter } from "next/navigation";

const Category = () => {
  const router = useRouter();
  const categories = [
    { _id: "1", name: "Mobile", slug: "electronics" },
    { _id: "2", name: "Laptop", slug: "clothing" },
    { _id: "3", name: "Shoes", slug: "shoes" },
    { _id: "4", name: "Dress", slug: "accessories" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => router.push(`/category/${cat.slug}`)}
            className="cursor-pointer px-6 py-3 bg-gray-800 hover:bg-blue-500 hover:text-white rounded-xl transition duration-300 shadow-sm"
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;