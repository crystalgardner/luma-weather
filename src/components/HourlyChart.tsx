import { motion } from "framer-motion";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PastelCard } from "./PastelCard";
import { HourlyForecast } from "@/contexts/WeatherContext";

interface HourlyChartProps {
  data: HourlyForecast[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: HourlyForecast;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card rounded-2xl shadow-luma-md p-4 border border-border">
        <p className="font-bold text-lg">{label}</p>
        <p className="text-2xl font-bold">{data.temperature}°</p>
        <p className="text-sm text-muted-foreground">Feels like {data.feelsLike}°</p>
        <div className="mt-2 text-sm space-y-1">
          <p>💧 Precip: {data.precipitationProbability}%</p>
          <p>💨 Wind: {data.windSpeed} mph {data.windDirection}</p>
          <p>☁️ Clouds: {data.cloudCover}%</p>
        </div>
      </div>
    );
  }
  return null;
};

export const HourlyChart = ({ data }: HourlyChartProps) => {
  const chartData = data.slice(0, 12).map((hour) => ({
    ...hour,
    time: hour.time.replace(" AM", "a").replace(" PM", "p"),
  }));

  const minTemp = Math.min(...chartData.map((d) => d.temperature)) - 5;
  const maxTemp = Math.max(...chartData.map((d) => d.temperature)) + 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PastelCard tint="white" interactive={false} density="normal">
        <h3 className="font-bold text-lg mb-4">Temperature Trend</h3>
        <div className="h-64 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>

              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                dy={10}
              />
              <YAxis
                domain={[minTemp, maxTemp]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="hsl(350, 70%, 70%)"
                strokeWidth={3}
                fill="hsl(350, 70%, 91%)"
                fillOpacity={0.4}
                dot={{ fill: "hsl(350, 70%, 70%)", strokeWidth: 0, r: 4 }}
                activeDot={{ fill: "hsl(350, 70%, 60%)", strokeWidth: 0, r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-pastel-pink" />
          <span>Temperature (°F)</span>
        </div>
      </PastelCard>
    </motion.div>
  );
};
