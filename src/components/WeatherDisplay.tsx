"use client";
import React from "react";
import { WiCloud, WiDaySunny, WiCloudy, WiRain } from "react-icons/wi";

type WeatherData = [string, string | number | null];
type WeatherPeriodData = [WeatherData, WeatherData, WeatherData];
type Cache = Record<string, Record<string, WeatherPeriodData>>;
interface WeatherDataProps {
  data: Cache; // Use the Cache type to avoid `any`
  targetRegion: string;
}

export const WeatherDisplay: React.FC<WeatherDataProps> = ({
  data,
  targetRegion,
}) => {
  if (!data[targetRegion])
    return <p className="text-gray-500">No data available.</p>;

  return (
    <div className="bg-gray-800 text-white rounded-xl p-4 w-full max-w-lg mx-auto mt-4 shadow-lg">
      <h2 className="text-lg font-bold text-gray-300 mb-3">7-Day Forecast</h2>
      <div className="space-y-2">
        {Object.entries(data[targetRegion]).map(([dayPeriod, values]) => {
          const [weekday, period] = dayPeriod.split(" - ");

          const rainProb = values[0]?.[1] ?? 0;
          const minTemp = values[1]?.[1] ?? 0;
          const maxTemp = values[2]?.[1] ?? 0;

          const rainProbNumber = typeof rainProb === 'number' ? rainProb : Number(rainProb);
          const minTempNumber = typeof minTemp === 'number' ? minTemp : Number(minTemp);
          const maxTempNumber = typeof maxTemp === 'number' ? maxTemp : Number(maxTemp);

          let WeatherIcon = WiCloud;
          if (rainProbNumber > 50) WeatherIcon = WiRain;
          else if (rainProbNumber > 20) WeatherIcon = WiCloudy;
          else WeatherIcon = WiDaySunny;

          return (
            <div
              key={dayPeriod}
              className="flex items-center justify-between border-b border-gray-700 py-2"
            >
              {/* Weekday & Weather Icon */}
              <div className="flex items-center space-x-2 w-28">
                <p className="text-sm font-medium">
                  {weekday} {period}
                </p>
              </div>
              <WeatherIcon className="text-2xl" />

              {/* Precipitation Probability */}
              <p className="text-blue-400 text-sm w-10">
                {rainProbNumber > 0 ? `${rainProbNumber}%` : `0%`}
              </p>

              {/* Min / Max Temperature */}
              <p className="text-sm">{minTempNumber}°</p>
              {/* Min-Max Temp Bar */}
              <div className="relative w-full max-w-[120px] h-2 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="absolute h-2 rounded-full bg-gradient-to-r from-green-400 to-yellow-400"
                  style={{
                    left: `${(minTempNumber / 40) * 100}%`,
                    width: `${((maxTempNumber - minTempNumber) / 40) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm">{maxTempNumber}°</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
