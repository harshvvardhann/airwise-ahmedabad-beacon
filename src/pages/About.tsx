
import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Wind, Gauge, AlertCircle, ThermometerIcon, CloudRain, Filter } from 'lucide-react';
import { pollutantInfo } from '@/utils/helpers';
import { Pollutant } from '@/types/air-quality';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About AirWise</h1>
          <p className="text-gray-600 mb-8">
            Understanding air quality and its impact on our health and environment
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wind className="h-5 w-5 mr-2 text-primary" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                AirWise is dedicated to providing real-time air quality monitoring and data visualization for Ahmedabad.
                Our goal is to raise awareness about air pollution levels and help citizens make informed decisions
                about their outdoor activities and health precautions.
              </p>
              <p className="text-gray-700 mt-4">
                By leveraging data from the OpenAQ platform, we track various pollutants and present them in an 
                easy-to-understand format, making environmental data accessible to everyone.
              </p>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Air Quality</h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gauge className="h-5 w-5 mr-2 text-primary" />
                <span>Air Quality Index (AQI)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                The Air Quality Index (AQI) is a scale used to communicate how polluted the air currently is or how polluted
                it is forecast to become. It helps people understand when to take precautions to protect their health.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-aqi-good bg-opacity-10 border border-aqi-good">
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-4 rounded-full bg-aqi-good mr-2"></div>
                    <h3 className="font-bold">Good (0-50)</h3>
                  </div>
                  <p className="text-sm">Air quality is considered satisfactory, and air pollution poses little or no risk.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-aqi-moderate bg-opacity-10 border border-aqi-moderate">
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-4 rounded-full bg-aqi-moderate mr-2"></div>
                    <h3 className="font-bold">Moderate (51-100)</h3>
                  </div>
                  <p className="text-sm">Air quality is acceptable; however, some pollutants may be a concern for a small number of people.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-aqi-unhealthy bg-opacity-10 border border-aqi-unhealthy">
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-4 rounded-full bg-aqi-unhealthy mr-2"></div>
                    <h3 className="font-bold">Unhealthy for Sensitive Groups (101-150)</h3>
                  </div>
                  <p className="text-sm">Members of sensitive groups may experience health effects. The general public is less likely to be affected.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-aqi-bad bg-opacity-10 border border-aqi-bad">
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-4 rounded-full bg-aqi-bad mr-2"></div>
                    <h3 className="font-bold">Unhealthy (151-200)</h3>
                  </div>
                  <p className="text-sm">Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-aqi-severe bg-opacity-10 border border-aqi-severe">
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-4 rounded-full bg-aqi-severe mr-2"></div>
                    <h3 className="font-bold">Very Unhealthy (201-300) & Hazardous (>300)</h3>
                  </div>
                  <p className="text-sm">Health alert: everyone may experience more serious health effects. Emergency conditions may be triggered.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Air Pollutants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(pollutantInfo).map(([key, info]) => (
              <Card key={key} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Filter className="h-4 w-4 mr-2" style={{ color: info.color }} />
                    <span>{info.name} - {info.fullName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{info.description}</p>
                  <div className="mt-2 flex items-center">
                    <div className="text-xs text-gray-500">Measured in:</div>
                    <div className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{info.unit}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Effects of Air Pollution</h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                <span>Health Impacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900">Short-term Health Effects</h3>
                  <p className="text-gray-700 mt-1">
                    Exposure to high levels of air pollution can cause immediate health effects including:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-700">
                    <li>Irritation of the eyes, nose, and throat</li>
                    <li>Coughing, wheezing, and shortness of breath</li>
                    <li>Aggravation of existing respiratory conditions</li>
                    <li>Headaches and dizziness</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-bold text-gray-900">Long-term Health Effects</h3>
                  <p className="text-gray-700 mt-1">
                    Long-term exposure to air pollution can lead to more serious health issues:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-700">
                    <li>Respiratory diseases and infections</li>
                    <li>Reduced lung function and development</li>
                    <li>Cardiovascular diseases</li>
                    <li>Increased risk of stroke</li>
                    <li>Potential links to cancer and other serious conditions</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-bold text-gray-900">Vulnerable Groups</h3>
                  <p className="text-gray-700 mt-1">
                    Some people are more sensitive to air pollution:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-700">
                    <li>Children and infants</li>
                    <li>Elderly individuals</li>
                    <li>People with pre-existing respiratory or cardiac conditions</li>
                    <li>Pregnant women</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Data</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudRain className="h-5 w-5 mr-2 text-primary" />
                <span>Data Sources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                AirWise sources its data from OpenAQ, an open-source platform aggregating air quality data from official monitoring stations worldwide.
                The data is updated hourly and includes measurements for key pollutants across multiple monitoring stations in Ahmedabad.
              </p>
              <p className="text-gray-700 mt-4">
                While we strive for accuracy, please note that this application is for informational purposes only. For official air quality alerts and health advisories, please refer to local environmental protection agencies and health departments.
              </p>
              <p className="text-gray-700 mt-4">
                This project is a demonstration and educational tool. It is not affiliated with any governmental organization.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
