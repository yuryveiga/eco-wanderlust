import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Wind, Thermometer, MapPin, Loader2, Calendar, Clock as ClockIcon } from "lucide-react";
import { format, addDays, startOfHour } from "date-fns";
import { ptBR } from "date-fns/locale";

export function WeatherSection() {
  const [forecast, setForecast] = useState<{
    time: string[];
    temp: number[];
    code: number[];
    wind: number[];
    humidity: number[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Selection state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(startOfHour(new Date()).getHours());

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-22.9064&longitude=-43.1822&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo"
        );
        const data = await res.json();
        
        if (data && data.hourly) {
          setForecast({
            time: data.hourly.time,
            temp: data.hourly.temperature_2m,
            code: data.hourly.weather_code,
            wind: data.hourly.wind_speed_10m,
            humidity: data.hourly.relative_humidity_2m
          });
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Céu Limpo";
    if (code <= 3) return "Parcialmente Nublado";
    if (code >= 51 && code <= 67) return "Chuva Leve";
    if (code >= 71) return "Chuva Forte / Temporal";
    return "Nublado";
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-12 h-12 text-amber-500 animate-pulse-slow" />;
    if (code <= 3) return <Cloud className="w-12 h-12 text-slate-400" />;
    return <CloudRain className="w-12 h-12 text-blue-500" />;
  };

  // Find the index for selected date and hour
  const getSelectedIndex = () => {
    if (!forecast) return -1;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const hourStr = selectedHour.toString().padStart(2, "0");
    const target = `${dateStr}T${hourStr}:00`;
    return forecast.time.findIndex(t => t.startsWith(target));
  };

  const index = getSelectedIndex();
  const weather = index !== -1 && forecast ? {
    temp: Math.round(forecast.temp[index]),
    code: forecast.code[index],
    wind: Math.round(forecast.wind[index]),
    humidity: forecast.humidity[index],
    description: getWeatherDesc(forecast.code[index])
  } : null;

  // Generate options for next 7 days
  const dateOptions = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));
  const hourOptions = Array.from({ length: 24 }).map((_, i) => i);

  return (
    <section className="py-12 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-3xl border border-border/50 p-6 md:p-10 shadow-sm flex flex-col items-center justify-between gap-10 overflow-hidden relative group hover:shadow-md transition-all">
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-sans font-bold uppercase tracking-widest text-xs">
                <MapPin className="w-4 h-4" /> Rio de Janeiro, Brasil
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Planeje seu passeio!</h2>
              <p className="text-muted-foreground font-sans max-w-md">
                Escolha o dia e horário do seu passeio para ver a previsão do tempo detalhada.
              </p>
            </div>

            {/* Selection Controls */}
            <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-4 rounded-2xl border border-border/50">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-sans font-bold uppercase text-muted-foreground ml-1">Data</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <select 
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background font-sans text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none min-w-[180px]"
                    value={selectedDate.toISOString()}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  >
                    {dateOptions.map(d => (
                      <option key={d.toISOString()} value={d.toISOString()}>
                        {format(d, "eeee, dd 'de' MMM", { locale: ptBR })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-sans font-bold uppercase text-muted-foreground ml-1">Horário</Label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <select 
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background font-sans text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none min-w-[120px]"
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(Number(e.target.value))}
                  >
                    {hourOptions.map(h => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center py-4 bg-primary/5 rounded-3xl relative z-10 border border-primary/10">
            {loading ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                <span className="text-xs text-muted-foreground font-sans">Carregando previsão...</span>
              </div>
            ) : weather ? (
              <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-20">
                <div className="flex flex-col items-center gap-1 group">
                  <div className="p-4 bg-background rounded-full shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {getWeatherIcon(weather.code)}
                  </div>
                  <span className="text-lg font-bold font-sans text-foreground mt-2">{weather.description}</span>
                </div>
                
                <div className="h-20 w-px bg-border/50 hidden sm:block" />
                
                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-8 h-8 text-red-500" />
                    <span className="text-7xl font-black font-sans text-foreground tracking-tighter">{weather.temp}°C</span>
                  </div>
                  <div className="flex gap-8 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-sans font-bold text-muted-foreground tracking-widest">Vento</span>
                      <div className="flex items-center gap-1.5 font-sans font-bold text-lg text-foreground/80">
                        <Wind className="w-4 h-4 text-primary" /> {weather.wind} km/h
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-sans font-bold text-muted-foreground tracking-widest">Umidade</span>
                      <div className="flex items-center gap-1.5 font-sans font-bold text-lg text-foreground/80">
                        <CloudRain className="w-4 h-4 text-primary" /> {weather.humidity}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic font-sans py-8">Dados indisponíveis para este horário.</p>
            )}
          </div>

          <div className="w-full flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-sans z-10 pt-2 opacity-50">
             <ClockIcon className="w-3 h-3" /> Atualizado em tempo real via Open-Meteo
          </div>
        </div>
      </div>
    </section>
  );
}

// Small helper for labels inside the component
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`block ${className}`}>{children}</span>;
}
