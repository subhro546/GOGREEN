import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/authOptions";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddressManager from "../../../components/AddressManager";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      addresses: {
        select: { id: true, address: true },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { orders: true } },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 bg-brand-hero min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-brand-secondary italic mb-8">My Profile</h1>

          <div className="bg-white rounded-3xl shadow-xl border border-brand/5 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-brand-secondary to-brand-topbar p-8 text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mb-4">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h2 className="text-2xl font-bold">{user.name || "User"}</h2>
              <p className="text-white/80">{user.email}</p>
            </div>

            {/* Profile Details */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-brand-hero rounded-2xl p-6">
                  <p className="text-sm text-text-dark/60 font-medium mb-1">Full Name</p>
                  <p className="text-lg font-bold text-text-dark">{user.name || "—"}</p>
                </div>
                <div className="bg-brand-hero rounded-2xl p-6">
                  <p className="text-sm text-text-dark/60 font-medium mb-1">Email Address</p>
                  <p className="text-lg font-bold text-text-dark">{user.email}</p>
                </div>
                <div className="bg-brand-hero rounded-2xl p-6">
                  <p className="text-sm text-text-dark/60 font-medium mb-1">Account Role</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    user.role === "ADMIN" ? "bg-brand-secondary text-white" : "bg-white text-brand-topbar"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="bg-brand-hero rounded-2xl p-6">
                  <p className="text-sm text-text-dark/60 font-medium mb-1">Member Since</p>
                  <p className="text-lg font-bold text-text-dark">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-brand-hero rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-dark/60 font-medium mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-brand-secondary">{user._count.orders}</p>
                </div>
                <a
                  href="/orders"
                  className="bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-lg hover:shadow-xl"
                >
                  View Orders →
                </a>
              </div>

              <div className="mt-8 border-t border-brand/10 pt-8">
                <AddressManager initialAddresses={user.addresses} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
