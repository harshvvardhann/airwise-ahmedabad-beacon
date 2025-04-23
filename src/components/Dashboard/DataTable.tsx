
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Table as TableIcon } from 'lucide-react';
import { AirQualityData, Pollutant } from '@/types/air-quality';
import { formatDate, pollutantInfo } from '@/utils/helpers';

type DataTableProps = {
  data: AirQualityData[];
};

const DataTable = ({ data }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <TableIcon className="h-5 w-5 mr-2" />
            <span>Air Quality Data</span>
          </CardTitle>
          <div className="w-1/3">
            <Input
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>AQI</TableHead>
                {Object.keys(pollutantInfo).map((key) => (
                  <TableHead key={key}>{pollutantInfo[key as Pollutant].name}</TableHead>
                ))}
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <TableRow key={row.location}>
                    <TableCell className="font-medium">{row.location}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white
                          ${row.level === 'good' ? 'bg-aqi-good' : 
                            row.level === 'moderate' ? 'bg-aqi-moderate' : 
                            row.level === 'unhealthy' ? 'bg-aqi-unhealthy' : 
                            row.level === 'bad' ? 'bg-aqi-bad' : 'bg-aqi-severe'}`}
                      >
                        {row.aqi}
                      </span>
                    </TableCell>
                    {Object.entries(pollutantInfo).map(([key]) => (
                      <TableCell key={key}>
                        {row.measurements[key as Pollutant] !== null
                          ? `${row.measurements[key as Pollutant]} ${pollutantInfo[key as Pollutant].unit}`
                          : 'N/A'}
                      </TableCell>
                    ))}
                    <TableCell className="text-xs text-gray-500">{formatDate(row.timestamp)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
