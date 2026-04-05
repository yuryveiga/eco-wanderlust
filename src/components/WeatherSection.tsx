import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Wind, Thermometer, MapPin, Loader2 } from "lucide-react";

export function WeatherSection() {
  const [weather, setWeather] = useState<{
    temp: number;
    description: string;
    code: number;
    wind: number;
    humidity: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Rio de Janeiro coordinates: -22.9064, -43.1822
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-22.9064&longitude=-43.1822&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo"
        );
        const data = await res.json();
        
        if (data && data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
            wind: Math.round(data.current.wind_speed_10m),
            humidity: data.current.relative_humidity_2m,
            description: getWeatherDesc(data.current.weather_code)
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

  return (
    <section className="py-12 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <MapPin className="w-32 h-32 text-primary" />
          </div>
          
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2 text-primary font-sans font-bold uppercase tracking-widest text-xs">
              <MapPin className="w-4 h-4" /> Rio de Janeiro, Brasil
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground">Prepare-se para o dia!</h2>
            <p className="text-muted-foreground font-sans max-w-md">
              Veja a previsão do tempo em tempo real para planejar seu passeio da melhor forma.
            </p>
          </div>

          <div className="flex items-center gap-8 relative z-10">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                <span className="text-xs text-muted-foreground font-sans">Carregando...</span>
              </div>
            ) : weather ? (
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  {getWeatherIcon(weather.code)}
                  <span className="text-sm font-bold font-sans mt-2 text-foreground/80">{weather.description}</span>
                </div>
                
                <div className="h-16 w-px bg-border/50 hidden sm:block" />
                
                <div className="flex flex-col items-center sm:items-start group">
                  <div className="flex items-center gap-1 group-hover:scale-110 transition-transform origin-left">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <span className="text-5xl font-black font-sans text-foreground">{weather.temp}°C</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                      <Wind className="w-3 h-3" /> {weather.wind} km/h
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                      <CloudRain className="w-3 h-3" /> {weather.humidity}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Previsão indisponível</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
