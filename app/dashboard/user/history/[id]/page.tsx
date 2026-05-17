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
  
  const shortId = id.slice(0, 8).toUpperCase();
  return {
    title: `Riwayat Order #${shortId}`,
    description: `Details and receipt for your Angkutin order ${id}. Track your waste management journey.`,
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  return <OrderDetailView id={id} />;
}
