import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  GalleryVerticalEnd,
} from "lucide-react";
import ja from "@/lib/i18n";

const navigation = [
  { name: ja.navigation.dashboard, href: "/", icon: LayoutDashboard },
  { name: ja.navigation.accounts, href: "/accounts", icon: Building2 },
  { name: ja.navigation.contacts, href: "/contacts", icon: Users },
  { name: ja.navigation.opportunities, href: "/opportunities", icon: GalleryVerticalEnd },
];

export default function SidebarNav() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                item.href === location
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
              )}
            >
              <item.icon
                className={cn(
                  item.href === location
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-accent-foreground",
                  "mr-3 h-5 w-5 flex-shrink-0"
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
