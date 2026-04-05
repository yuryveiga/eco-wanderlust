## Plano: Painel de Admin - Passeio Rio

### 1. Banco de Dados (Migrations)
Criar as tabelas:
- **tours** - id, title, short_description, price, duration, max_group_size, image_url, is_featured, category, is_active, sort_order
- **pages** - id, title, href, is_visible, sort_order (controla itens do menu do header)
- **site_images** - id, key (ex: "logo", "hero_bg"), image_url, label
- **social_media** - id, platform, url, icon_name, is_active, sort_order
- Storage bucket "site-images" para uploads

### 2. Autenticação
- Página de login admin (/admin/login) usando Supabase Auth
- Conta admin: veiga.yury@gmail.com (o usuário criará a conta no primeiro acesso)
- Rotas protegidas com verificação de auth
- RLS policies para proteger os dados

### 3. Painel de Admin (/admin)
- **Dashboard** com visão geral
- **Passeios** - CRUD completo com upload de imagem
- **Páginas/Menu** - Gerenciar quais páginas aparecem no header, reordenar
- **Imagens do Site** - Gerenciar logo, hero background, imagens de seções
- **Redes Sociais** - Cadastrar/editar links (Instagram, TripAdvisor, WhatsApp, etc.)

### 4. Integração com o Site
- Header dinâmico: carrega páginas do banco
- Hero dinâmico: carrega imagem de fundo do banco
- Tours dinâmicos: carrega passeios do banco
- Footer dinâmico: carrega redes sociais do banco
- Logo dinâmico: carrega do banco

### 5. Arquitetura
- Sidebar admin com navegação
- Layout responsivo
- Formulários com validação
- Upload de imagens com preview
