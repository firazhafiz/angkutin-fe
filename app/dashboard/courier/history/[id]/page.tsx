import React from "react";
import OrderDetailView from "../../missions/[id]/OrderDetailView";

export default async function CourierHistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailView id={id} />;
}
