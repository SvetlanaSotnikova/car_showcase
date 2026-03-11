"use client";

import { useAuth } from "@/contents/AuthContext";
import { isAdmin } from "@/utils";
import AdminLogin from "@/components/AdminLogin";
import AdminCarsTable from "@/components/AdminCarsTable";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!isAdmin(user?.email)) {
    return <AdminLogin />;
  }

  return <AdminCarsTable />;
}