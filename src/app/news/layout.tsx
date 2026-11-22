import type { Metadata } from "next";
import { getRouteMetadata } from "@/data/route-metadata";

export const metadata: Metadata = getRouteMetadata("/news");

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
