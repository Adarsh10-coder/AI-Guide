import React from "react";
import LargeHeader from "./LargeHeader";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-[#0D0D0F] text-[#F3F0F7] flex flex-col">
      <LargeHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">{children}</main>
      </div>
    </div>
  );
}
