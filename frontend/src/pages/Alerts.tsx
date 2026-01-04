import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { fetchNotifications, markNotificationAsRead, getNotificationPreferences, updateNotificationPreferences } from '@/utils/api';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

const Alerts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications(false, 50), // Get unread notifications
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch notification preferences
  const { data: preferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: getNotificationPreferences,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'Success',
        description: 'Notification marked as read',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    },
  });

  // Update notification preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
      toast({
        title: 'Success',
        description: 'Notification preferences updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive',
      });
    },
  });

  const handleAlertToggle = (type: 'email' | 'push', checked: boolean) => {
    const updateData: { emailNotifications?: boolean; pushNotifications?: boolean } = {};
    if (type === 'email') {
      updateData.emailNotifications = checked;
    } else {
      updateData.pushNotifications = checked;
    }
    updatePreferencesMutation.mutate(updateData);
  };

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const getAlertColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'high':
      case 'danger':
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'warning':
      case 'moderate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load notifications',
      variant: 'destructive',
    });
  }

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
            {notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${getAlertColor(notification.type)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold">{notification.type || 'Alert'}</h3>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="ml-2 text-xs underline hover:no-underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No active alerts
              </div>
            )}
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
                <Switch 
                  checked={preferences?.emailNotifications ?? true}
                  onCheckedChange={(checked) => handleAlertToggle('email', checked)}
                  disabled={isLoadingPreferences || updatePreferencesMutation.isPending}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive browser notifications</p>
                </div>
                <Switch 
                  checked={preferences?.pushNotifications ?? true}
                  onCheckedChange={(checked) => handleAlertToggle('push', checked)}
                  disabled={isLoadingPreferences || updatePreferencesMutation.isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alerts;
