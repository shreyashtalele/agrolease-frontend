import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
