
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const Alerts = () => {
  const { toast } = useToast();

  const handleAlertToggle = (alertType: string) => {
    toast({
      title: "Alert Preference Updated",
      description: `${alertType} alerts have been ${alertType === 'email' ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <AlertTriangle className="h-6 w-6 mr-2 text-amber-500" />
        <h1 className="text-3xl font-bold">Alert Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Current Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-100 rounded-lg">
                <h3 className="font-bold text-red-700">High PM2.5 Levels</h3>
                <p className="text-sm text-red-600">Maninagar area showing dangerous PM2.5 levels</p>
                <p className="text-xs text-red-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-4 bg-amber-100 rounded-lg">
                <h3 className="font-bold text-amber-700">Elevated NO2</h3>
                <p className="text-sm text-amber-600">Moderate NO2 levels in Satellite area</p>
                <p className="text-xs text-amber-500 mt-1">5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellOff className="h-5 w-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive alerts via email</p>
                </div>
                <Switch onCheckedChange={() => handleAlertToggle('email')} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive browser notifications</p>
                </div>
                <Switch onCheckedChange={() => handleAlertToggle('push')} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alerts;
