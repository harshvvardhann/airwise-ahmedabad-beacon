
import React, { useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, Factory, Car, Home as HomeIcon, Plane, ShoppingBag, Activity, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for emissions
const emissionsData = [
  { month: 'Jan', scope1: 120, scope2: 240, scope3: 450, total: 810 },
  { month: 'Feb', scope1: 110, scope2: 220, scope3: 430, total: 760 },
  { month: 'Mar', scope1: 140, scope2: 250, scope3: 470, total: 860 },
  { month: 'Apr', scope1: 130, scope2: 230, scope3: 440, total: 800 },
  { month: 'May', scope1: 150, scope2: 260, scope3: 490, total: 900 },
  { month: 'Jun', scope1: 170, scope2: 280, scope3: 520, total: 970 },
];

const forecastData = [
  { month: 'Jul', predicted: 950, target: 900 },
  { month: 'Aug', predicted: 930, target: 880 },
  { month: 'Sep', predicted: 910, target: 860 },
  { month: 'Oct', predicted: 890, target: 840 },
  { month: 'Nov', predicted: 870, target: 820 },
  { month: 'Dec', predicted: 850, target: 800 },
];

// Carbon intensity for common activities (kg CO2e)
const carbonIntensity = {
  electricity: 0.41, // per kWh
  naturalGas: 0.18, // per kWh
  petrol: 2.31, // per liter
  diesel: 2.68, // per liter
  flight: 0.25, // per km (economy)
  beef: 27, // per kg
  lamb: 39, // per kg
  cheese: 13.5, // per kg
  milk: 1.9, // per liter
  vegetables: 2, // per kg
  fruit: 1.1, // per kg
};

// Scope categories
const scopeCategories = {
  scope1: ['Direct emissions from owned sources', 'Fuel combustion', 'Company vehicles', 'Fugitive emissions'],
  scope2: ['Indirect emissions from purchased electricity', 'Purchased electricity', 'Purchased heating/cooling', 'Purchased steam'],
  scope3: ['All other indirect emissions', 'Business travel', 'Employee commuting', 'Waste disposal', 'Purchased goods and services', 'Use of sold products', 'Transportation and distribution', 'Investments']
};

const Emissions = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calculatorType, setCalculatorType] = useState('business');
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [reduction, setReduction] = useState(20);

  // Calculator form state
  const [calculatorInputs, setCalculatorInputs] = useState({
    electricity: '',
    naturalGas: '',
    petrol: '',
    travel: '',
    purchasing: '',
  });

  const handleCalculatorInput = (field: string, value: string) => {
    setCalculatorInputs((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    toast({
      title: "Calculation Complete",
      description: "Your carbon footprint has been calculated. See the results below.",
    });
  };

  const handleReductionChange = (value: number[]) => {
    setReduction(value[0]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart2 className="h-8 w-8 mr-2 text-primary" />
              Carbon Emissions Tracker
            </h1>
            <p className="text-gray-600 mt-1">Monitor and reduce your carbon footprint</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="reduction">Reduction</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Total Emissions
                  </CardTitle>
                  <CardDescription>Current month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">970 tCO₂e</div>
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    +7.3% from previous month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Factory className="h-4 w-4 mr-2" />
                    Scope 1
                  </CardTitle>
                  <CardDescription>Direct emissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-500">170 tCO₂e</div>
                  <p className="text-sm text-gray-500 mt-1">17.5% of total</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Scope 2
                  </CardTitle>
                  <CardDescription>Indirect emissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-500">280 tCO₂e</div>
                  <p className="text-sm text-gray-500 mt-1">28.9% of total</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Scope 3
                  </CardTitle>
                  <CardDescription>Value chain emissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">520 tCO₂e</div>
                  <p className="text-sm text-gray-500 mt-1">53.6% of total</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emissions by Scope</CardTitle>
                  <CardDescription>6-month trend analysis</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={emissionsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="scope1" name="Scope 1" fill="#3b82f6" />
                        <Bar dataKey="scope2" name="Scope 2" fill="#f59e0b" />
                        <Bar dataKey="scope3" name="Scope 3" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Emission Forecast</CardTitle>
                  <CardDescription>Next 6 months prediction</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          name="Predicted Emissions" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          name="Reduction Target" 
                          stroke="#82ca9d" 
                          strokeDasharray="5 5"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Emissions Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Emissions Breakdown</CardTitle>
                <div className="flex space-x-2 items-center">
                  <CardDescription>Detailed analysis of emission sources</CardDescription>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[100px] h-8">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {emissionsData.map((item) => (
                        <SelectItem key={item.month} value={item.month}>
                          {item.month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(scopeCategories).map(([scope, categories]) => (
                    <div key={scope}>
                      <h3 className="font-medium mb-2 capitalize">{scope}</h3>
                      <ul className="space-y-2">
                        {categories.map((category, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">{category}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint Calculator</CardTitle>
                <CardDescription>Estimate your carbon emissions based on your activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex space-x-4 mb-4">
                    <Button 
                      variant={calculatorType === 'business' ? "default" : "outline"}
                      onClick={() => setCalculatorType('business')}
                      className="flex-1"
                    >
                      <Factory className="h-4 w-4 mr-2" /> Business
                    </Button>
                    <Button 
                      variant={calculatorType === 'personal' ? "default" : "outline"}
                      onClick={() => setCalculatorType('personal')}
                      className="flex-1"
                    >
                      <HomeIcon className="h-4 w-4 mr-2" /> Personal
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <HomeIcon className="h-4 w-4 mr-2 text-primary" /> Electricity (kWh)
                      </label>
                      <Input 
                        type="number" 
                        placeholder="Monthly usage"
                        value={calculatorInputs.electricity}
                        onChange={(e) => handleCalculatorInput('electricity', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <Factory className="h-4 w-4 mr-2 text-primary" /> Natural Gas (kWh)
                      </label>
                      <Input 
                        type="number" 
                        placeholder="Monthly usage"
                        value={calculatorInputs.naturalGas}
                        onChange={(e) => handleCalculatorInput('naturalGas', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <Car className="h-4 w-4 mr-2 text-primary" /> Vehicle Fuel (Liters)
                      </label>
                      <Input 
                        type="number" 
                        placeholder="Monthly consumption"
                        value={calculatorInputs.petrol}
                        onChange={(e) => handleCalculatorInput('petrol', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <Plane className="h-4 w-4 mr-2 text-primary" /> Business Travel (km)
                      </label>
                      <Input 
                        type="number" 
                        placeholder="Monthly distance"
                        value={calculatorInputs.travel}
                        onChange={(e) => handleCalculatorInput('travel', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-primary" /> Purchasing & Supply Chain (estimated value)
                      </label>
                      <Input 
                        type="number" 
                        placeholder="Monthly spend in USD"
                        value={calculatorInputs.purchasing}
                        onChange={(e) => handleCalculatorInput('purchasing', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCalculate} 
                    className="w-full mt-4"
                  >
                    Calculate Carbon Footprint
                  </Button>
                </div>
                
                {/* Results would appear here after calculation */}
                <div className="mt-8 p-6 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Calculation Results</h3>
                  <p className="text-gray-500 text-sm">Complete the form and click calculate to see your carbon footprint results.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reduction Tab */}
          <TabsContent value="reduction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Reduction Strategies</CardTitle>
                <CardDescription>Science-based targets and recommendations to reduce your emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Emission Reduction Target</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Slide to set your reduction goal. Science-based targets recommend 45% reduction by 2030.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">0%</span>
                        <Slider
                          value={[reduction]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleReductionChange}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium">100%</span>
                      </div>
                      <div className="flex justify-center">
                        <span className="text-2xl font-bold text-primary">{reduction}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium mb-3 flex items-center">
                        <Factory className="h-4 w-4 mr-2 text-primary" />
                        Scope 1 & 2 Recommendations
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                          <span>Switch to renewable energy sources for office operations</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                          <span>Upgrade to energy-efficient equipment and lighting</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                          <span>Transition company vehicles to electric or hybrid models</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">4</span>
                          <span>Install smart building management systems</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-3 flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-primary" />
                        Scope 3 Recommendations
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                          <span>Implement a sustainable procurement policy</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                          <span>Engage suppliers on their carbon reduction efforts</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                          <span>Reduce business travel and promote virtual meetings</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">4</span>
                          <span>Optimize logistics and transportation routes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Carbon Reduction Roadmap
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Short Term (0-6 months)</span>
                          <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-md">5-10% reduction</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Medium Term (6-18 months)</span>
                          <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-md">15-25% reduction</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Long Term (18-36 months)</span>
                          <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-md">30-45% reduction</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Emissions;
