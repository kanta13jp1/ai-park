"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { featureStatusMaster } from "@/data/feature-status";
import { ROUTE_METADATA } from "@/data/route-metadata";
import {
  normalizeAiParkRoutePath,
  registerAiParkWebMcpTools,
  type AiParkWebMcpRouteInfo,
  type WebMcpModelContext,
} from "@/lib/webmcp";

declare global {
  interface Document {
    readonly modelContext?: WebMcpModelContext;
  }
}

export default function WebMcpBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const routes = useMemo<AiParkWebMcpRouteInfo[]>(() => {
    const statusMap = new Map(featureStatusMaster.map((f) => [f.href, f]));
    const homeFeature = statusMap.get("/");
    const list: AiParkWebMcpRouteInfo[] = [
      {
        path: "/",
        title: "ポータルトップ",
        description: "MightyLINK AI Park 社内AIポータルトップ（導入・初級・実践の3ステップ導線）",
        status: homeFeature?.status ?? "verified",
        badge: homeFeature?.currentBadge ?? "公開中",
      },
    ];

    for (const [routePath, meta] of Object.entries(ROUTE_METADATA)) {
      const feature = statusMap.get(routePath);
      list.push({
        path: routePath,
        title: meta.title,
        description: meta.description,
        status: feature?.status,
        badge: feature?.currentBadge,
      });
    }
    return list;
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || !document.modelContext) {
      return;
    }

    const controller = registerAiParkWebMcpTools({
      modelContext: document.modelContext,
      routes,
      navigate: (targetPath) => {
        router.push(targetPath);
      },
      openCommandPalette: (query) => {
        window.dispatchEvent(
          new CustomEvent("ai-park-open-command-palette", {
            detail: query ? { query } : undefined,
          })
        );
      },
      getCurrentPage: () => {
        const rawPath = pathnameRef.current || window.location.pathname;
        const normalized = normalizeAiParkRoutePath(rawPath);
        const headings = Array.from(document.querySelectorAll("main h1, main h2, main h3"))
          .map((el) => el.textContent?.trim() ?? "")
          .filter(Boolean)
          .slice(0, 20);
        return {
          path: normalized,
          title: document.title,
          headings,
        };
      },
    });

    return () => {
      controller?.abort();
    };
  }, [router, routes]);

  return null;
}
