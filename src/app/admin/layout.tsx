import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/authOptions";
import { redirect } from "next/navigation";
import AdminLayoutClient from "../../../components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

