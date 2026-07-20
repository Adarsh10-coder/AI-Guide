import React from "react";
import LargeHeader from "./LargeHeader";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F3F0F7]">
      <LargeHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
