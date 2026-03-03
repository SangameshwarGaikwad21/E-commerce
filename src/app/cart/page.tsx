"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "@/redux/fetures/cartSlice";

export default function Page() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {items.map((item:any) => (
            <div
              key={item.id}
              className="flex items-center gap-6 border-b py-6"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {item.title}
                </h2>
                <p className="text-gray-600">
                  ₹{item.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      dispatch(decreaseQuantity(item.id))
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(increaseQuantity(item.id))
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() =>
                  dispatch(removeFromCart(item.id))
                }
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total Section */}
          <div className="mt-8 text-right">
            <h2 className="text-xl font-bold">
              Total: ₹{total}
            </h2>
          </div>
        </>
      )}
    </div>
  );
}