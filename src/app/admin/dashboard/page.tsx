"use client";

import axiosInstance from "@/lib/axios";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Boxes,
  IndianRupee,
  PackageSearch,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

type RecentProduct = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  stock?: number;
  images?: string[];
};

type RecentOrder = {
  _id: string;
  totalPrice?: number;
  totalAmount?: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "COD" | "RAZORPAY";
  createdAt: string;
};

type ChartPoint = {
  day: string;
  orders: number;
  revenue: number;
};

type DashboardData = {
  counts: {
    products: number;
    users: number;
    orders: number;
    revenue: number;
  };
  recentProducts: RecentProduct[];
  recentOrders: RecentOrder[];
  orderChart: ChartPoint[];
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Page() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getDashboard = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<DashboardData>("/admin/dashboard");
        setDashboard(res.data);
      } catch {
        setError("Dashboard data not loaded");
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  const sevenDayRevenue = useMemo(() => {
    return (
      dashboard?.orderChart.reduce((total, item) => total + item.revenue, 0) || 0
    );
  }, [dashboard]);

  const stats = [
    {
      title: "Total Products",
      value: dashboard?.counts.products || 0,
      icon: Boxes,
      tone: "from-purple-600 to-indigo-600",
      helper: "Live catalog items",
    },
    {
      title: "Total Users",
      value: dashboard?.counts.users || 0,
      icon: Users,
      tone: "from-blue-500 to-cyan-500",
      helper: "Registered accounts",
    },
    {
      title: "Total Orders",
      value: dashboard?.counts.orders || 0,
      icon: ShoppingBag,
      tone: "from-pink-500 to-rose-500",
      helper: "All-time orders",
    },
    {
      title: "Total Revenue",
      value: currency.format(dashboard?.counts.revenue || 0),
      icon: IndianRupee,
      tone: "from-amber-400 to-orange-500",
      helper: "Valid order value",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-56 animate-pulse rounded-xl bg-white/10" />
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30" />
        <div className="absolute top-[-120px] left-[-120px] h-[460px] w-[460px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-[-140px] right-[-120px] h-[460px] w-[460px] rounded-full bg-pink-600/20 blur-[140px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-purple-400">
              <Sparkles size={16} />
              Admin Control
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Track products, users, orders, revenue and the newest activity in
              one clean view.
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`rounded-3xl bg-gradient-to-r ${item.tone} p-[1px] shadow-xl shadow-black/30`}
              >
                <div className="h-full rounded-3xl bg-black/80 p-5 backdrop-blur-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{item.title}</p>
                      <h2 className="mt-3 text-3xl font-bold">{item.value}</h2>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Icon size={22} />
                    </span>
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {item.helper}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Order Graph</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Orders and revenue from the last 7 days.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-300">
                Revenue:{" "}
                <span className="font-semibold text-white">
                  {currency.format(sevenDayRevenue)}
                </span>
              </div>
            </div>

            <div className="mt-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard?.orderChart || []}>
                  <defs>
                    <linearGradient id="orderFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 16,
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#c084fc"
                    strokeWidth={3}
                    fill="url(#orderFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold">Revenue Bars</h2>
            <p className="mt-1 text-sm text-slate-400">Daily order value.</p>

            <div className="mt-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard?.orderChart || []}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value) => currency.format(Number(value))}
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 16,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Recent Products</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Latest products added to store.
                </p>
              </div>
              <PackageSearch className="text-purple-400" size={24} />
            </div>

            <div className="mt-6 space-y-3">
              {(dashboard?.recentProducts || []).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 p-3"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images?.[0] || "/no-product.png"}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{product.title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {product.category || "Product"} • Stock {product.stock ?? 0}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-purple-300">
                    {currency.format(product.price)}
                  </p>
                </div>
              ))}

              {!dashboard?.recentProducts.length ? (
                <p className="rounded-2xl border border-white/10 bg-black/25 p-5 text-center text-sm text-slate-400">
                  No products found.
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>
            <p className="mt-1 text-sm text-slate-400">
              Fresh order activity from customers.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr] bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <span>Order</span>
                <span>Payment</span>
                <span>Status</span>
                <span className="text-right">Total</span>
              </div>

              {(dashboard?.recentOrders || []).map((order) => (
                <div
                  key={order._id}
                  className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr] items-center border-t border-white/10 px-4 py-4 text-sm"
                >
                  <span className="truncate text-slate-300">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-slate-400">{order.paymentMethod}</span>
                  <span className="w-fit rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                    {order.orderStatus}
                  </span>
                  <span className="text-right font-semibold">
                    {currency.format(order.totalPrice ?? order.totalAmount ?? 0)}
                  </span>
                </div>
              ))}

              {!dashboard?.recentOrders.length ? (
                <p className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-400">
                  No orders found.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
