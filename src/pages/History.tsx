
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CitySelector, { City } from '@/components/Common/CitySelector';
import LastUpdated from '@/components/Common/LastUpdated';

interface HistoricalRecord {
  id: string;
  date: string;
  city: string;
  aqi: number;
  co2: number;
  temperature: number;
  humidity: number;
  level: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
}

const History = () => {
  const [selectedCity, setSelectedCity] = useState<City>('ahmedabad');
  const [historicalData, setHistoricalData] = useState<HistoricalRecord[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof HistoricalRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data generation
  const generateMockData = (city: City): HistoricalRecord[] => {
    const data: HistoricalRecord[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const baseAQI = city === 'delhi' ? 150 : city === 'mumbai' ? 120 : 90;
      const aqi = baseAQI + Math.floor(Math.random() * 50) - 25;
      
      let level: 'good' | 'moderate' | 'unhealthy' | 'hazardous' = 'good';
      if (aqi > 150) level = 'hazardous';
      else if (aqi > 100) level = 'unhealthy';
      else if (aqi > 50) level = 'moderate';
      
      data.push({
        id: `${city}-${i}`,
        date: date.toISOString().split('T')[0],
        city: city,
        aqi,
        co2: 3 + Math.random() * 4,
        temperature: 25 + Math.random() * 15,
        humidity: 50 + Math.random() * 30,
        level,
      });
    }
    
    return data;
  };

  const fetchHistoricalData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = generateMockData(selectedCity);
    setHistoricalData(data);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [selectedCity]);

  const handleSort = (field: keyof HistoricalRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...historicalData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'good': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'unhealthy': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'hazardous': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const exportData = () => {
    const csv = [
      ['Date', 'City', 'AQI', 'CO2 (tons)', 'Temperature (°C)', 'Humidity (%)', 'Level'],
      ...sortedData.map(row => [
        row.date,
        row.city,
        row.aqi.toString(),
        row.co2.toFixed(2),
        row.temperature.toFixed(1),
        row.humidity.toFixed(1),
        row.level
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airwise-history-${selectedCity}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading historical data...</p>
        </div>
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
            <CitySelector 
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
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
              <div className="text-2xl font-bold text-primary">{historicalData.length}</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Avg AQI</div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(historicalData.reduce((sum, item) => sum + item.aqi, 0) / historicalData.length)}
              </div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Avg CO₂</div>
              <div className="text-2xl font-bold text-foreground">
                {(historicalData.reduce((sum, item) => sum + item.co2, 0) / historicalData.length).toFixed(1)} tons
              </div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Good Days</div>
              <div className="text-2xl font-bold text-green-400">
                {historicalData.filter(item => item.level === 'good').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="eco-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historical Records
            </CardTitle>
            <LastUpdated 
              lastUpdate={lastUpdate}
              onRefresh={fetchHistoricalData}
              autoRefresh={true}
              refreshInterval={600000} // 10 minutes
            />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('date')}
                    >
                      Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('aqi')}
                    >
                      AQI {sortField === 'aqi' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('co2')}
                    >
                      CO₂ (tons) {sortField === 'co2' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('temperature')}
                    >
                      Temp (°C) {sortField === 'temperature' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('humidity')}
                    >
                      Humidity (%) {sortField === 'humidity' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((record) => (
                    <TableRow key={record.id} className="border-border/30 hover:bg-card/50">
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${record.aqi > 150 ? 'text-red-400' : record.aqi > 100 ? 'text-orange-400' : record.aqi > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {record.aqi}
                        </span>
                      </TableCell>
                      <TableCell>{record.co2.toFixed(2)}</TableCell>
                      <TableCell>{record.temperature.toFixed(1)}</TableCell>
                      <TableCell>{record.humidity.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge className={`${getLevelColor(record.level)} font-medium`}>
                          {record.level}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
