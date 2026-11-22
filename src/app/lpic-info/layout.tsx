import type { Metadata } from "next";
import { getRouteMetadata } from "@/data/route-metadata";

export const metadata: Metadata = getRouteMetadata("/lpic-info");

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
