import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";

const MaracanaCalendar = () => {
  const [calendarUrl] = useState("https://maracanamatchday.com/calendar");

  useEffect(() => {
    // Update document title and meta tags for SEO
    document.title = "Calendário de Jogos do Maracanã - Tocorime Rio";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro.");
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", "Calendário de Jogos do Maracanã - Tocorime Rio");
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", "Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro.");
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", window.location.href);
    } else {
      const metaOgUrl = document.createElement('meta');
      metaOgUrl.setAttribute("property", "og:url");
      metaOgUrl.setAttribute("content", window.location.href);
      document.head.appendChild(metaOgUrl);
    }
    
    const ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      const metaOgType = document.createElement('meta');
      metaOgType.setAttribute("property", "og:type");
      metaOgType.setAttribute("content", "website");
      document.head.appendChild(metaOgType);
    }
  }, []);

  return (
    <main>
      <Helmet>
        <title>Calendário de Jogos do Maracanã - Tocorime Rio</title>
        <meta name="description" content="Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro." />
        <meta property="og:title" content="Calendário de Jogos do Maracanã - Tocorime Rio" />
        <meta property="og:description" content="Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calendário de Jogos do Maracanã - Tocorime Rio" />
        <meta name="twitter:description" content="Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Calendário de Jogos do Maracanã
          </h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Como funciona nosso calendário
              </h2>
            </div>
            <div className="px-6 py-6">
              <p className="text-gray-700 mb-4">
                Nosso calendário é atualizado em tempo real com informações diretamente do 
                <a href="https://maracanamatchday.com/calendar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Maracanã Match Day
                </a>. Aqui você encontra todos os jogos, shows e eventos programados no Estádio do Maracanã.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                    Dica: Combine sua visita ao jogo com um dos nossos passeios exclusivos pelo Rio de Janeiro!
                </p>
              </div>
              
              <div className="ratio ratio-16x9">
                <iframe 
                  title="Calendário do Estádio Maracanã" 
                  src="https://maracanamatchday.com/calendar" 
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Combine seu passeio com um jogo no Maracanã
            </h2>
            <p className="text-gray-600 mb-6">
              A Tocorime Rio oferece passeios especiais que podem ser combinados com os jogos no Estádio do Maracanã. 
              Confira nossos roteiros personalizados para tornar sua experiência ainda mais completa.
            </p>
            <div className="text-center">
              <a href="/passeio" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Ver Nossos Passeios
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default MaracanaCalendar;