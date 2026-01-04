import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchHistoricalData, fetchLocations } from '@/utils/api';
import { Pollutant, AirQualityHistorical } from '@/types/air-quality';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const History = () => {
    const { toast } = useToast();
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedPollutant, setSelectedPollutant] = useState<Pollutant | null>(null);
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);

    // Fetch locations
    const { data: locations } = useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocations,
    });

    // Fetch historical data
    const {
        data: historicalData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['historicalData', selectedLocation, selectedPollutant, dateFrom, dateTo],
        queryFn: () => fetchHistoricalData(selectedLocation, selectedPollutant, dateFrom, dateTo),
    });

    // Handle errors in useEffect to avoid infinite re-renders
    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to load historical data',
                variant: 'destructive',
            });
        }
    }, [error, toast]);

    const exportData = () => {
        if (!historicalData || historicalData.length === 0) {
            toast({
                title: 'No Data',
                description: 'No data available to export',
                variant: 'destructive',
            });
            return;
        }

        const csv = [
            ['Date', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'],
            ...historicalData.map((item: AirQualityHistorical) => [
                item.date,
                item.measurements?.pm25 || '',
                item.measurements?.pm10 || '',
                item.measurements?.no2 || '',
                item.measurements?.so2 || '',
                item.measurements?.co || '',
                item.measurements?.o3 || '',
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `airwise-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
            title: 'Success',
            description: 'Data exported successfully',
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Historical Data</h1>
                        <p className="text-muted-foreground">Past environmental readings and trends</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={selectedLocation || ''}
                            onChange={(e) => setSelectedLocation(e.target.value || null)}
                            className="px-4 py-2 border rounded-md"
                        >
                            <option value="">All Locations</option>
                            {locations?.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                        <Button onClick={exportData} variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="eco-card">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Records</div>
                            <div className="text-2xl font-bold text-primary">{historicalData?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="eco-card">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Avg PM2.5</div>
                            <div className="text-2xl font-bold text-foreground">
                                {historicalData && historicalData.length > 0
                                    ? Math.round(
                                          historicalData.reduce(
                                              (sum: number, item: AirQualityHistorical) => sum + (item.measurements?.pm25 || 0),
                                              0
                                          ) / historicalData.length
                                      )
                                    : 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="eco-card">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Avg PM10</div>
                            <div className="text-2xl font-bold text-foreground">
                                {historicalData && historicalData.length > 0
                                    ? Math.round(
                                          historicalData.reduce(
                                              (sum: number, item: AirQualityHistorical) => sum + (item.measurements?.pm10 || 0),
                                              0
                                          ) / historicalData.length
                                      )
                                    : 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="eco-card">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Data Points</div>
                            <div className="text-2xl font-bold text-green-400">{historicalData?.length || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card className="eco-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Historical Records
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {historicalData && historicalData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/50">
                                            <TableHead>Date</TableHead>
                                            <TableHead>PM2.5</TableHead>
                                            <TableHead>PM10</TableHead>
                                            <TableHead>NO2</TableHead>
                                            <TableHead>SO2</TableHead>
                                            <TableHead>CO</TableHead>
                                            <TableHead>O3</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historicalData.map((item: AirQualityHistorical, index: number) => (
                                            <TableRow key={index} className="border-border/30 hover:bg-card/50">
                                                <TableCell className="font-medium">{new Date(item.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    {item.measurements?.pm25 != null ? item.measurements.pm25.toFixed(2) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.measurements?.pm10 != null ? item.measurements.pm10.toFixed(2) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.measurements?.no2 != null ? item.measurements.no2.toFixed(2) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.measurements?.so2 != null ? item.measurements.so2.toFixed(2) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.measurements?.co != null ? item.measurements.co.toFixed(2) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.measurements?.o3 != null ? item.measurements.o3.toFixed(2) : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">No historical data available</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default History;
