// app/order/page.tsx (серверный компонент)
import { Suspense } from "react";
import OrderContent from "@/app/order/OrderContent";

export default function OrderPage() {
  return (
    <Suspense fallback={<div>Loading order form...</div>}>
      <OrderContent />
    </Suspense>
  );
}