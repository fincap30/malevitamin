import { redirect } from "next/navigation";
import {
  Package,
  CreditCard,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  LogOut,
  Wallet,
  Users,
} from "lucide-react";

import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin/auth";
import { db } from "@/lib/db";

// This page reads cookies + the database, so it can never be statically rendered.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

type OrderRow = {
  id: string;
  txRef: string;
  status: string;
  amount: number;
  currency: string;
  demo: boolean;
  paymentType: string | null;
  deliveryOption: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  ownerShare: number;
  partnerShare: number;
  createdAt: Date;
  paidAt: Date | null;
};

type WhatsAppRow = {
  id: string;
  phone: string;
  fromName: string | null;
  message: string;
  intent: string | null;
  direction: string;
  createdAt: Date;
};

type DashboardData = {
  orders: OrderRow[];
  messages: WhatsAppRow[];
  dbError: boolean;
};

async function loadDashboardData(): Promise<DashboardData> {
  let orders: OrderRow[] = [];
  let messages: WhatsAppRow[] = [];
  let dbError = false;

  try {
    orders = (await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    })) as unknown as OrderRow[];
  } catch (error) {
    console.error("[Admin] Failed to load orders:", error);
    dbError = true;
  }

  try {
    messages = (await db.whatsAppMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    })) as unknown as WhatsAppRow[];
  } catch (error) {
    console.error("[Admin] Failed to load WhatsApp messages:", error);
    dbError = true;
  }

  return { orders, messages, dbError };
}

function formatCurrency(amount: number, currency = "ZAR"): string {
  const symbol = currency === "ZAR" ? "R" : `${currency} `;
  return `${symbol}${amount.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: Date): string {
  try {
    return new Date(date).toLocaleString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(date);
  }
}

function statusBadge(status: string) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide";
  switch (status) {
    case "successful":
      return (
        <span className={`${base} bg-green-500/10 text-green-400 border border-green-500/20`}>
          <CheckCircle2 className="w-3 h-3" /> Successful
        </span>
      );
    case "pending":
      return (
        <span className={`${base} bg-amber-500/10 text-amber-400 border border-amber-500/20`}>
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    case "failed":
      return (
        <span className={`${base} bg-red-500/10 text-red-400 border border-red-500/20`}>
          <XCircle className="w-3 h-3" /> Failed
        </span>
      );
    case "demo":
      return (
        <span className={`${base} bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
          Demo
        </span>
      );
    default:
      return (
        <span className={`${base} bg-foreground/10 text-foreground/60 border border-foreground/20`}>
          {status}
        </span>
      );
  }
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-[#0c0b09] border border-gold/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-gold/60 mb-3">
        {icon}
        <span className="text-xs font-bold tracking-widest uppercase">{label}</span>
      </div>
      <div className="text-2xl font-black text-foreground">{value}</div>
      {sub && <div className="text-xs text-foreground/40 mt-1">{sub}</div>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { orders, messages, dbError } = await loadDashboardData();
  const configured = isAdminConfigured();

  // --- Compute analytics -----------------------------------------------------
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6); // last 7 days inclusive

  const paidOrders = orders.filter(
    (o) => o.status === "successful" || o.status === "demo"
  );
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const ownerEarnings = paidOrders.reduce((sum, o) => sum + (o.ownerShare || 0), 0);
  const partnerEarnings = paidOrders.reduce(
    (sum, o) => sum + (o.partnerShare || 0),
    0
  );
  const avgOrderValue = paidOrders.length
    ? totalRevenue / paidOrders.length
    : 0;

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) >= startOfToday
  ).length;
  const ordersThisWeek = orders.filter(
    (o) => new Date(o.createdAt) >= startOfWeek
  ).length;

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const inboundMessages = messages.filter((m) => m.direction === "inbound");
  const intentCounts = messages.reduce<Record<string, number>>((acc, m) => {
    const key = m.intent || "general";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#050504] text-foreground">
      {/* Header */}
      <header className="border-b border-gold/10 bg-[#0c0b09]/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">
              Male<span className="text-gold">Vitamin</span> Admin
            </h1>
            <p className="text-xs text-foreground/40">Orders, payments &amp; messages</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/50 hover:text-gold border border-gold/20 hover:border-gold/50 rounded-lg px-3 py-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Warnings */}
        {!configured && (
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Default password in use</p>
              <p className="text-amber-300/80">
                No <code className="font-mono">ADMIN_PASSWORD</code> is set, so the
                insecure default (<code className="font-mono">changeme</code>) is
                active. Set a strong <code className="font-mono">ADMIN_PASSWORD</code>{" "}
                environment variable / worker secret to secure this dashboard.
              </p>
            </div>
          </div>
        )}

        {dbError && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Database unavailable</p>
              <p className="text-red-300/80">
                Could not read order / message data. The live site runs on
                Cloudflare Workers, which has no persistent filesystem, so the
                bundled SQLite database does not work there. To store live orders
                and messages, connect a hosted database (e.g. Cloudflare D1,
                Postgres/Neon, or PlanetScale). Locally the SQLite database works
                normally.
              </p>
            </div>
          </div>
        )}

        {/* Stat cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Package className="w-4 h-4" />}
            label="Total Orders"
            value={String(orders.length)}
            sub={`${ordersToday} today · ${ordersThisWeek} this week`}
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Revenue"
            value={formatCurrency(totalRevenue)}
            sub={`${paidOrders.length} paid order${paidOrders.length === 1 ? "" : "s"}`}
          />
          <StatCard
            icon={<CreditCard className="w-4 h-4" />}
            label="Avg Order"
            value={formatCurrency(avgOrderValue)}
            sub="Per paid order"
          />
          <StatCard
            icon={<MessageCircle className="w-4 h-4" />}
            label="WhatsApp"
            value={String(messages.length)}
            sub={`${inboundMessages.length} inbound`}
          />
        </section>

        {/* Earnings split + status breakdown */}
        <section className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#0c0b09] border border-gold/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gold/60 mb-4">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">
                Earnings Split
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Owner share (25%)</span>
                <span className="font-black text-foreground">
                  {formatCurrency(ownerEarnings)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Partner share (75%)</span>
                <span className="font-black text-foreground">
                  {formatCurrency(partnerEarnings)}
                </span>
              </div>
              <div className="h-px bg-gold/10" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Total collected</span>
                <span className="font-black text-gold">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0c0b09] border border-gold/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gold/60 mb-4">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">
                Orders by Status
              </span>
            </div>
            <div className="space-y-2">
              {Object.keys(statusCounts).length === 0 && (
                <p className="text-sm text-foreground/40">No orders yet.</p>
              )}
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  {statusBadge(status)}
                  <span className="font-bold text-foreground/80">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent orders */}
        <section className="bg-[#0c0b09] border border-gold/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gold/10 flex items-center gap-2">
            <Package className="w-4 h-4 text-gold/60" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-gold/60">
              Recent Orders
            </h2>
          </div>
          {orders.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-foreground/40">
              No orders to display yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-foreground/40 border-b border-gold/10">
                    <th className="px-5 py-3 font-bold">Date</th>
                    <th className="px-5 py-3 font-bold">Customer</th>
                    <th className="px-5 py-3 font-bold">Amount</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Delivery</th>
                    <th className="px-5 py-3 font-bold">Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 50).map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-gold/5 hover:bg-gold/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap text-foreground/70">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-bold text-foreground">
                          {o.customerName || "—"}
                        </div>
                        <div className="text-xs text-foreground/40">
                          {o.customerEmail}
                        </div>
                        {o.customerPhone && (
                          <div className="text-xs text-foreground/40">
                            {o.customerPhone}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap font-black text-foreground">
                        {formatCurrency(o.amount, o.currency)}
                      </td>
                      <td className="px-5 py-3">{statusBadge(o.status)}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-foreground/60 capitalize">
                        {o.deliveryOption || "—"}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap font-mono text-xs text-foreground/40">
                        {o.txRef}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* WhatsApp messages */}
        <section className="bg-[#0c0b09] border border-gold/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gold/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gold/60" />
              <h2 className="text-sm font-bold tracking-widest uppercase text-gold/60">
                WhatsApp Messages
              </h2>
            </div>
            {Object.keys(intentCounts).length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1.5">
                {Object.entries(intentCounts).map(([intent, count]) => (
                  <span
                    key={intent}
                    className="text-xs px-2 py-0.5 rounded-full bg-gold/5 border border-gold/10 text-foreground/50 capitalize"
                  >
                    {intent}: {count}
                  </span>
                ))}
              </div>
            )}
          </div>
          {messages.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-foreground/40">
              No WhatsApp messages to display yet.
            </div>
          ) : (
            <ul className="divide-y divide-gold/5">
              {messages.slice(0, 50).map((m) => (
                <li key={m.id} className="px-5 py-4 hover:bg-gold/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground">
                          {m.fromName || m.phone}
                        </span>
                        <span className="text-xs text-foreground/40">{m.phone}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            m.direction === "inbound"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {m.direction}
                        </span>
                        {m.intent && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gold/5 border border-gold/10 text-foreground/50 capitalize">
                            {m.intent}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/70 mt-1 break-words">
                        {m.message}
                      </p>
                    </div>
                    <span className="text-xs text-foreground/30 whitespace-nowrap shrink-0">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
