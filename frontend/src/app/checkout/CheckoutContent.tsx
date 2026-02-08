"use client";

import { useSearchParams } from "next/navigation";

export default function CheckoutContent() {
  const params = useSearchParams();

  return (
    <div>
      Checkout Page
    </div>
  );
}
