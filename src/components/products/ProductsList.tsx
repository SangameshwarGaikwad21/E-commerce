"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";

const ProductList = () => {
  const dispatch = useAppDispatch();

  const { products, loading, error } =
    useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((item) => (
        <div key={item.id}>
          <img src={item.image} />
          <h2>{item.name}</h2>
          <p>₹{item.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;