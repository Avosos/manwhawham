"use client";

import dynamic from "next/dynamic";

const MainLayout = dynamic(() => import("@/components/layout/main-layout"), { ssr: false });

export default function Home() {
  return <MainLayout />;
}
