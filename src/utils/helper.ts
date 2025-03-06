export interface ElementValue {
  ProbabilityOfPrecipitation?: number;
  MinTemperature?: number;
  MaxTemperature?: number;
}

export interface WeatherTimeData {
  StartTime: string;
  EndTime: string;
  ElementValue: ElementValue[];
}

export interface WeatherElement {
  ElementName: string;
  Time: WeatherTimeData[];
}

export interface WeatherData {
  weatherInfo: WeatherElement[];
}

export interface Cache {
  [changeName: string]: {
    [key: string]: [
      [string, string | number | null] | null, // ProbabilityOfPrecipitation
      [string, string | number | null] | null, // MinTemperature
      [string, string | number | null] | null  // MaxTemperature
    ];
  };
}

export const processWeatherData = (
  tempTarget: WeatherData | undefined,
  changeName: string,
  cache: Cache
) => {
  if (!tempTarget) return;

  cache[changeName] = cache[changeName] || {};

  tempTarget.weatherInfo.forEach(({ ElementName, Time }) => {
    Time.forEach(({ StartTime, EndTime, ElementValue }) => {
      const key = getFormattedKey(StartTime, EndTime);

      cache[changeName][key] = cache[changeName][key] || [null, null, null];

      const weatherValues: Array<[string, number | null] | null> = [
        ElementValue[0]?.ProbabilityOfPrecipitation
          ? [ElementName, ElementValue[0].ProbabilityOfPrecipitation]
          : null,
        ElementValue[0]?.MinTemperature
          ? [ElementName, ElementValue[0].MinTemperature]
          : null,
        ElementValue[0]?.MaxTemperature
          ? [ElementName, ElementValue[0].MaxTemperature]
          : null,
      ];

      weatherValues.forEach((value, index) => {
        if (value) cache[changeName][key][index] = value;
      });
    });
  });
};

const getDayAndTimePeriod = (timeRange: string) => {
  const [startTime] = timeRange.split(" - "); // Extract start time
  const date = new Date(startTime);

  // Get the weekday (Monday-Sunday)
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

  // Determine AM or PM
  const hour = date.getHours();
  const period = hour < 12 ? "AM" : "PM";

  return { weekday, period };
};

const getFormattedKey = (start: string, end: string) => {
  const { weekday, period } = getDayAndTimePeriod(`${start} - ${end}`);
  return `${weekday} - ${period}`;
};
