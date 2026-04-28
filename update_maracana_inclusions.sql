-- Script to update Maracanã MatchDay inclusions
UPDATE tours 
SET included_json = '[{"text": "Transfer"}, {"text": "Ingressos"}, {"text": "Guia Bilíngue"}]',
    included_json_en = '[{"text": "Transfer"}, {"text": "Tickets"}, {"text": "Bilingual Guide"}]',
    included_json_es = '[{"text": "Traslado"}, {"text": "Entradas"}, {"text": "Guía Bilingüe"}]'
WHERE title ILIKE '%Maracanã MatchDay%';
