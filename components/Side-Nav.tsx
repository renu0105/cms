"use client";
import { Tooltip } from "@radix-ui/react-tooltip";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { Button } from "./ui/button";
import { cmsNavItems } from "@/lib/data";
import { useClerk } from "@clerk/nextjs";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon | null;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem = ({ href, icon: Icon, label, isCollapsed }: NavItemProps) => {
  const pathName = usePathname();
  const isActive = pathName === href;
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    if (label === "Logout") {
      await signOut();
    }
    router.push("/login");
  };

  return isCollapsed ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            onClick={handleLogout}
            className={`flex flex-col h-16 w-16 items-center justify-center mx-auto  ${
              isActive
                ? "bg-orange-400"
                : "hover:bg-white hover:text-orange-400"
            }`}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>

        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Link
      href={href}
      onClick={handleLogout}
      className={`flex items-center gap-5 p-5 font-medium ${
        isActive ? "bg-orange-400" : "hover:bg-white hover:text-orange-400"
      }`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{label}</span>
    </Link>
  );
};

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`fixed top-0 text-white flex flex-col border transition-all duration-300 backdrop-blur-xl z-20 bg-black min-h-screen ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-center h-16 border-b p-3">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 ">
            <Button variant="ghost" className="text-xl font-bold">
              cms
            </Button>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto "
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 " />
          ) : (
            <ChevronLeft className="h-5 w-5 " />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto ">
        {cmsNavItems.map((item) => (
          <NavItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isCollapsed={isCollapsed}
            onClick={() => {}}
          />
        ))}
      </nav>
    </div>
  );
};
export default SideNav;
