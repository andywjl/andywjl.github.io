"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Wrench,
  AlertCircle,
  BarChart3,
  FolderKanban,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "数据总览", icon: LayoutDashboard },
  { href: "/campus", label: "园区档案", icon: Building2 },
  { href: "/equipment", label: "设备台账", icon: Wrench },
  { href: "/issues", label: "问题看板", icon: AlertCircle },
  { href: "/metrics", label: "指标监控", icon: BarChart3 },
  { href: "/projects", label: "改造项目", icon: FolderKanban },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-md"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">楼宇档案</h1>
              <p className="text-[10px] text-gray-400">Building Archive System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-semibold">
              管
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">管理员</p>
              <p className="text-[10px] text-gray-400">系统管理</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
