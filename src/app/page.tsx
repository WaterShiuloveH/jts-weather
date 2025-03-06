"use client";
import { useState, useEffect } from "react";
import { processWeatherData } from "../utils/helper";
import { WeatherDisplay } from "../components/WeatherDisplay";
import Loading from "../components/Loading";
interface WeatherTimeData {
  StartTime: string;
  EndTime: string;
  ElementValue: Array<{
    ProbabilityOfPrecipitation?: number;
    MinTemperature?: number;
    MaxTemperature?: number;
  }>;
}
interface WeatherElement {
  ElementName: string;
  Time: WeatherTimeData[];
}

interface Region {
  region: string;
  weatherInfo: WeatherElement[];
}
interface Location {
  Geocode: string;
  Latitude: string;
  Longitude: string;
  LocationName: string;
  WeatherElement: WeatherElement[];
}
type WeatherData = [string, string | number | null];
type WeatherPeriodData = [WeatherData, WeatherData, WeatherData];
type Cache = Record<string, Record<string, WeatherPeriodData>>;

const cache: Cache = {};
const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function WeatherApp() {
  const [city, setCity] = useState<string>("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [targetRegion, setTargetRegion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=${apiKey}&format=JSON&ElementName=`
      );
      const data = await response.json();
      const {
        success,
        records: { Locations },
      } = data;

      if (success) {
        const { LocationsName, Location } = Locations?.[0];
        setCity(LocationsName);
        const regionData: Region[] = Location.map((loc: Location) => ({
          region: loc.LocationName,
          weatherInfo: loc.WeatherElement.filter((el) =>
            ["12小時降雨機率", "最低溫度", "最高溫度"].includes(el.ElementName)
          ),
        }));

        if (regionData.length > 0) {
          processWeatherData(regionData[0], regionData[0].region, cache);
          setRegions(regionData);
          setTargetRegion(regionData[0].region);
        }
      }
    } catch (error) {
      console.error("Error fetching initial city data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tempValue = e.target.value;
    const tempTarget = regions.find((region) => region.region === tempValue);

    if (!tempTarget) return;

    setTargetRegion(tempValue);

    if (!cache[tempTarget.region]) {
      processWeatherData(tempTarget, tempTarget.region, cache);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">JTS Weather App</h1>
      <h2 className="text-2xl text-white font-bold mb-4">{city}</h2>

      <select
        value={targetRegion}
        onChange={handleRegionChange}
        className="p-2 border rounded w-64 text-center"
        disabled={loading}
      >
        {regions.map(({ region }) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <WeatherDisplay data={cache} targetRegion={targetRegion} />
    </div>
  );
}
