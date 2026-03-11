"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { isAdmin } from "@/utils";
import { AdminLogin, AdminCarsTable } from "@/components";

export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setAdminUser(isAdmin(user?.email) ? user : null);
    });

    return unsub;
  }, []);

  if (!adminUser) {
    return <AdminLogin />;
  }

  return <AdminCarsTable />;
}
