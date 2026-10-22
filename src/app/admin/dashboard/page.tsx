"use client";

import axiosInstance from "@/lib/axios";
import { animate, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  CalendarDays,
  IndianRupee,
  PackageSearch,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
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

const orderStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  SHIPPED: "bg-sky-50 text-sky-700 ring-sky-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: "text-amber-600",
  PAID: "text-emerald-600",
  FAILED: "text-red-600",
};

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  PROCESSING: "#4f46e5",
  SHIPPED: "#0ea5e9",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(49,46,129,0.12)",
  color: "#0f172a",
};

/* ---------- animated number ---------- */
function AnimatedNumber({
  value,
  format = (n: number) => Math.round(n).toLocaleString("en-IN"),
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{format(0)}</span>;
}

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`rounded-3xl bg-white p-6 shadow-xl shadow-indigo-900/5 ${className}`}
  >
    {children}
  </section>
);

export default function Page() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [metric, setMetric] = useState<"orders" | "revenue">("orders");

  const getDashboard = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError("");
      const res = await axiosInstance.get<DashboardData>("/admin/dashboard");
      setDashboard(res.data);
    } catch {
      setError("Dashboard data not loaded");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  const sevenDayRevenue = useMemo(
    () =>
      dashboard?.orderChart.reduce((total, item) => total + item.revenue, 0) || 0,
    [dashboard]
  );

  const sevenDayOrders = useMemo(
    () =>
      dashboard?.orderChart.reduce((total, item) => total + item.orders, 0) || 0,
    [dashboard]
  );

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    (dashboard?.recentOrders || []).forEach((o) => {
      counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [dashboard]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      title: "Total Products",
      value: dashboard?.counts.products || 0,
      format: undefined,
      icon: Boxes,
      iconBg: "bg-indigo-100 text-indigo-700",
      bar: "bg-indigo-500",
      helper: "Live catalog items",
      href: "/admin/product/productlist",
    },
    {
      title: "Total Users",
      value: dashboard?.counts.users || 0,
      format: undefined,
      icon: Users,
      iconBg: "bg-sky-100 text-sky-700",
      bar: "bg-sky-500",
      helper: "Registered accounts",
      href: "/admin/users",
    },
    {
      title: "Total Orders",
      value: dashboard?.counts.orders || 0,
      format: undefined,
      icon: ShoppingBag,
      iconBg: "bg-emerald-100 text-emerald-700",
      bar: "bg-emerald-500",
      helper: "All-time orders",
      href: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: dashboard?.counts.revenue || 0,
      format: (n: number) => currency.format(Math.round(n)),
      icon: IndianRupee,
      iconBg: "bg-amber-100 text-amber-700",
      bar: "bg-amber-400",
      helper: "Valid order value",
      href: "/admin/orders",
    },
  ];

  /* ---------- loading skeleton ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-40 animate-pulse rounded-3xl bg-indigo-200/60" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5"
              />
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="h-96 animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5" />
            <div className="h-96 animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-indigo-700 p-8 text-white shadow-2xl shadow-indigo-900/10 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full border-[44px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/30" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
                <Sparkles size={16} /> Admin Control
              </p>
              <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-xl text-indigo-100">
                Track products, users, orders and revenue — plus the newest
                activity — in one clean view.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-indigo-50">
                <CalendarDays size={14} /> {today}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => getDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/25 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing" : "Refresh"}
              </button>
              <Link
                href="/admin/product/productlist"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-black/10 transition hover:bg-amber-300"
              >
                Manage products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* error banner */}
        {error ? (
          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span className="flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </span>
            <button
              onClick={() => getDashboard()}
              className="rounded-lg bg-white px-3 py-1.5 font-semibold text-red-700 shadow-sm transition hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* ================= STATS ================= */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  href={item.href}
                  className="group relative block overflow-hidden rounded-3xl bg-white p-5 shadow-xl shadow-indigo-900/5 ring-1 ring-transparent transition hover:shadow-2xl hover:shadow-indigo-900/10 hover:ring-indigo-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-500">
                        {item.title}
                      </p>
                      <h2 className="mt-3 truncate text-3xl font-extrabold text-slate-900">
                        <AnimatedNumber
                          value={item.value}
                          format={item.format}
                        />
                      </h2>
                    </div>
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconBg}`}
                    >
                      <Icon size={22} />
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {item.helper}
                    </p>
                    <ArrowRight
                      size={16}
                      className="-translate-x-1 text-indigo-600 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </div>

                  <span
                    className={`absolute inset-x-0 bottom-0 h-1 ${item.bar}`}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ================= CHARTS ================= */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
                  <TrendingUp size={22} className="text-indigo-700" />
                  Performance
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Last 7 days of orders and revenue.
                </p>
              </div>

              {/* metric toggle */}
              <div className="inline-flex rounded-xl bg-indigo-50 p-1">
                {(["orders", "revenue"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className="relative rounded-lg px-4 py-2 text-sm font-semibold capitalize"
                  >
                    {metric === m && (
                      <motion.span
                        layoutId="metric-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-white shadow"
                      />
                    )}
                    <span
                      className={`relative ${
                        metric === m ? "text-indigo-700" : "text-slate-500"
                      }`}
                    >
                      {m}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* mini summary */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-indigo-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  7-day orders
                </p>
                <p className="mt-1 text-2xl font-extrabold text-indigo-700">
                  {sevenDayOrders}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  7-day revenue
                </p>
                <p className="mt-1 text-2xl font-extrabold text-amber-600">
                  {currency.format(sevenDayRevenue)}
                </p>
              </div>
            </div>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard?.orderChart || []}>
                  <defs>
                    <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={metric === "orders" ? "#4f46e5" : "#f59e0b"}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={metric === "orders" ? "#4f46e5" : "#f59e0b"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tickFormatter={(v) =>
                      metric === "revenue" ? `₹${Number(v) / 1000}k` : String(v)
                    }
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) =>
                      metric === "revenue"
                        ? [currency.format(Number(value)), "Revenue"]
                        : [value, "Orders"]
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey={metric}
                    stroke={metric === "orders" ? "#4f46e5" : "#f59e0b"}
                    strokeWidth={3}
                    fill="url(#metricFill)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Order status
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Breakdown of recent orders.
            </p>

            {statusBreakdown.length === 0 ? (
              <p className="mt-10 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                No orders to show yet.
              </p>
            ) : (
              <>
                <div className="relative mt-4 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={84}
                        paddingAngle={4}
                        stroke="none"
                      >
                        {statusBreakdown.map((s) => (
                          <Cell key={s.name} fill={statusColors[s.name] || "#6366f1"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-extrabold text-slate-900">
                      {dashboard?.recentOrders.length || 0}
                    </p>
                    <p className="text-xs text-slate-500">recent orders</p>
                  </div>
                </div>

                <div className="mt-2 space-y-2">
                  {statusBreakdown.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-slate-600">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ background: statusColors[s.name] || "#6366f1" }}
                        />
                        <span className="capitalize">{s.name.toLowerCase()}</span>
                      </span>
                      <span className="font-bold text-slate-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* ================= RECENT ================= */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          {/* products */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Recent Products
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest products added to store.
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                <PackageSearch size={22} />
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {(dashboard?.recentProducts || []).map((product) => {
                const stock = product.stock ?? 0;
                const low = stock <= 5;

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/50"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images?.[0] || "/no-product.png"}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900">
                        {product.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-500">
                          {product.category || "Product"}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset ${
                            low
                              ? "bg-red-50 text-red-700 ring-red-200"
                              : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          }`}
                        >
                          {low ? `Low stock: ${stock}` : `Stock ${stock}`}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-indigo-700">
                      {currency.format(product.price)}
                    </p>
                  </motion.div>
                );
              })}

              {!dashboard?.recentProducts.length ? (
                <p className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No products found.
                </p>
              ) : null}
            </div>

            <Link
              href="/admin/product/productlist"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:gap-3"
            >
              View all products <ArrowRight size={16} />
            </Link>
          </Card>

          {/* orders */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Recent Orders
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fresh order activity from customers.
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                <ShoppingBag size={22} />
              </span>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[1.1fr_1fr_1fr_0.9fr] bg-indigo-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">
                  <span>Order</span>
                  <span>Payment</span>
                  <span>Status</span>
                  <span className="text-right">Total</span>
                </div>

                {(dashboard?.recentOrders || []).map((order) => (
                  <div
                    key={order._id}
                    className="grid grid-cols-[1.1fr_1fr_1fr_0.9fr] items-center border-t border-slate-100 px-4 py-4 text-sm transition hover:bg-indigo-50/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : ""}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-700">
                        {order.paymentMethod}
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          paymentStatusStyles[order.paymentStatus] ||
                          "text-slate-500"
                        }`}
                      >
                        {order.paymentStatus}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                        orderStatusStyles[order.orderStatus] ||
                        "bg-indigo-50 text-indigo-700 ring-indigo-200"
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    <span className="text-right font-extrabold text-slate-900">
                      {currency.format(order.totalPrice ?? order.totalAmount ?? 0)}
                    </span>
                  </div>
                ))}

                {!dashboard?.recentOrders.length ? (
                  <p className="border-t border-slate-100 px-4 py-10 text-center text-sm text-slate-500">
                    No orders found.
                  </p>
                ) : null}
              </div>
            </div>

            <Link
              href="/admin/orders"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:gap-3"
            >
              View all orders <ArrowRight size={16} />
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}