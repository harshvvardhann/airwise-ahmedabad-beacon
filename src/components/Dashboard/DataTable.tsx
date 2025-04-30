
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Table as TableIcon } from 'lucide-react';
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
    <Card className="h-full border-0 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center text-xl font-semibold">
            <TableIcon className="h-5 w-5 mr-2 text-primary" />
            <span>Air Quality Data</span>
          </CardTitle>
          <div className="w-full sm:w-1/3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 text-sm pl-10 pr-4 border-gray-200 focus:border-primary"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium">Location</TableHead>
                <TableHead className="font-medium text-center">AQI</TableHead>
                {Object.keys(pollutantInfo).map((key) => (
                  <TableHead key={key} className="font-medium text-center">
                    {pollutantInfo[key as Pollutant].name}
                    <span className="text-xs text-gray-500 block">
                      {pollutantInfo[key as Pollutant].unit}
                    </span>
                  </TableHead>
                ))}
                <TableHead className="font-medium">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <TableRow key={row.location} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{row.location}</TableCell>
                    <TableCell className="text-center">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white inline-block min-w-[40px] text-center
                          ${row.level === 'good' ? 'bg-aqi-good' : 
                            row.level === 'moderate' ? 'bg-aqi-moderate' : 
                            row.level === 'unhealthy' ? 'bg-aqi-unhealthy' : 
                            row.level === 'bad' ? 'bg-aqi-bad' : 'bg-aqi-severe'}`}
                      >
                        {row.aqi}
                      </span>
                    </TableCell>
                    {Object.entries(pollutantInfo).map(([key]) => (
                      <TableCell key={key} className="text-center">
                        {row.measurements[key as Pollutant] !== null
                          ? row.measurements[key as Pollutant]
                          : <span className="text-gray-400">--</span>}
                      </TableCell>
                    ))}
                    <TableCell className="text-xs text-gray-500">
                      {formatDate(row.timestamp)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-gray-300 mb-2" />
                      <span>No matching locations found</span>
                    </div>
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
