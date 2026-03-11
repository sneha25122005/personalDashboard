"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dashboard,
  Analytics,
  Calendar,
  Folder,
  Task,
  UserMultiple,
  DocumentAdd,
} from "@carbon/icons-react";

/* ---------------- ROUTE → SECTION MAP ---------------- */

const routeToSection: Record<string, string> = {
  "/": "dashboard",
  "/mood": "mood",
  "/sleep": "sleep",
  "/finance": "finance",
  "/academics": "academics",
  "/tasks": "tasks",
  "/resources": "resources",
};

/* ---------------- ICON NAV ITEMS ---------------- */

const iconNav = [
  { id: "dashboard", icon: <Dashboard size={18} />, href: "/" },
  { id: "mood", icon: <UserMultiple size={18} />, href: "/mood" },
  { id: "finance", icon: <Analytics size={18} />, href: "/finance" },
  { id: "academics", icon: <Folder size={18} />, href: "/academics" },
  { id: "tasks", icon: <Task size={18} />, href: "/tasks" },
  { id: "sleep", icon: <Calendar size={18} />, href: "/sleep" },
  { id: "resources", icon: <DocumentAdd size={18} />, href: "/resources" },
];

/* ---------------- ICON BUTTON ---------------- */

function IconButton({
  icon,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`size-10 rounded-lg flex items-center justify-center transition
        ${
          active
            ? "bg-neutral-800 text-white"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
        }`}
    >
      {icon}
    </button>
  );
}

/* ---------------- MAIN SIDEBAR ---------------- */

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    setActiveSection(routeToSection[pathname] || "dashboard");
  }, [pathname]);

  return (
    <div className="flex h-screen">
      {/* LEFT ICON RAIL */}
      <aside className="bg-black w-16 flex flex-col items-center gap-3 py-4 border-r border-neutral-800">
        {iconNav.map((item) => (
          <IconButton
            key={item.id}
            icon={item.icon}
            active={activeSection === item.id}
            onClick={() => router.push(item.href)}
          />
        ))}
      </aside>

      {/* RIGHT DETAIL SIDEBAR */}
      <aside className="bg-black w-80 border-r border-neutral-800 flex flex-col p-4 overflow-y-auto">
        <h2 className="text-white text-lg font-semibold mb-4 capitalize">
          {activeSection}
        </h2>

        <div className="space-y-3">
          <SidebarItem label="Dashboard" href="/" />
          <SidebarItem label="Mood" href="/mood" />
          <SidebarItem label="Finance" href="/finance" />
          <SidebarItem label="Academics" href="/academics" />
          <SidebarItem label="Tasks" href="/tasks" />
          <SidebarItem label="Sleep" href="/sleep" />
          <SidebarItem label="Resources" href="/resources" />
        </div>
      </aside>
    </div>
  );
}

/* ---------------- RIGHT SIDEBAR ITEM ---------------- */

function SidebarItem({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <div
      onClick={() => router.push(href)}
      className={`px-3 py-2 rounded-md text-sm cursor-pointer transition
        ${
          active
            ? "bg-neutral-800 text-white"
            : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
        }`}
    >
      {label}
    </div>
  );
}
