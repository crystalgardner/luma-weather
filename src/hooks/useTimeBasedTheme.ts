import { useTheme } from "@/contexts/ThemeContext";

export interface TimeOfDay {
  isNight: boolean;
  period: "morning" | "afternoon" | "evening" | "night";
  hour: number;
}

export const useTimeBasedTheme = () => {
  const { isNight, period } = useTheme();
  const hour = new Date().getHours();



  return {
    isNight,
    period: period as TimeOfDay["period"],
    hour
  };
};
