
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, TrendingUp, AlertTriangle, BarChart3, MapPin } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

const sidebarItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'History',
    url: '/history',
    icon: History,
  },
  {
    title: 'Predictions',
    url: '/predictions',
    icon: TrendingUp,
  },
  {
    title: 'Alerts',
    url: '/alerts',
    icon: AlertTriangle,
  },
  {
    title: 'Emissions',
    url: '/emissions',
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border/50 bg-card/30 backdrop-blur-sm">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">AirWise</h2>
            <p className="text-xs text-muted-foreground">Eco Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator className="bg-border/50" />
      
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                isActive={location.pathname === item.url}
                className="w-full justify-start gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors duration-200"
              >
                <Link to={item.url} className="flex items-center">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
