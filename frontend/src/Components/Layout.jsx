import React from "react";
import LargeHeader from "./LargeHeader";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-main)] flex flex-col">
      <LargeHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">{children}</main>
      </div>
    </div>
  );
}
