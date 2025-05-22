"use client"; // SidebarProvider and its hooks likely use client features

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  HandCoins,
  ListChecks,
  Users,
  FileText,
  Settings as SettingsIcon,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Briefcase,
  SlidersHorizontal
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  // useSidebar, // No longer directly used here for isMobile
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/payouts', label: 'Payout Requests', icon: HandCoins },
  { href: '/transactions', label: 'Transactions', icon: ListChecks },
  { href: '/stores', label: 'Store Accounts', icon: Users },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { href: '/settings', label: 'Configuration', icon: SlidersHorizontal },
];

function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-2">
      <DollarSign className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        DZD Control
      </h1>
    </Link>
  );
}

function UserProfileDropdown() {
  // const { user, signOut } = useAuth(); // Replace with your auth logic
  const user = { name: 'Admin User', email: 'admin@dzdpanel.com', imageUrl: 'https://placehold.co/100x100.png' };
  const signOut = () => alert("Signed out (mock)");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.imageUrl} alt={user.name} data-ai-hint="person avatar"/>
            <AvatarFallback>{user.name?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isClientMobile = useIsMobile(); // Use the hook directly

  // const { isMobile } = useSidebar(); // REMOVED: This was causing the error

  return (
    <SidebarProvider defaultOpen={!isClientMobile} open={!isClientMobile}>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r border-sidebar-border">
        <SidebarHeader className="h-16 flex items-center justify-between">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label, className: "bg-sidebar text-sidebar-foreground border-sidebar-border" }}
                  >
                    <a> {/* Link component needs an 'a' tag as child for legacyBehavior */}
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="h-16 flex items-center justify-center border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">© DZD Panel</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden" />
            {/* Breadcrumbs or page title can go here */}
          </div>
          <UserProfileDropdown />
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-background overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
