
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ChartLine, Info } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">AirWise</span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="flex items-center px-4 py-2 text-sm hover:text-primary">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/alerts" className="flex items-center px-4 py-2 text-sm hover:text-primary">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Alerts
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/predictions" className="flex items-center px-4 py-2 text-sm hover:text-primary">
                  <ChartLine className="h-4 w-4 mr-2" />
                  Predictions
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/about" className="flex items-center px-4 py-2 text-sm hover:text-primary">
                  <Info className="h-4 w-4 mr-2" />
                  About
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
