import React from "react";
import { Metadata } from "next";
import OrderDetailView from "./OrderDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * DYNAMIC METADATA GENERATION
 * This function runs on the server and allows us to set the browser title
 * and other meta tags dynamically based on the route parameters.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Order ${id} - Courier`,
    description: `Details and receipt for your Angkutin courier mission ${id}.`,
  };
}

export default async function CourierOrderDetailPage({ params }: Props) {
  const { id } = await params;

  return <OrderDetailView id={id} />;
}
