import{r as l,j as e,H as f}from"./index-CTHg2iVQ.js";const u=()=>{const o=new Date("2026-05-19T21:30:00-03:00"),[n,r]=l.useState({days:"00",hours:"00",mins:"00",secs:"00",isLive:!1});return l.useEffect(()=>{const s=()=>{const i=new Date,a=o.getTime()-i.getTime();if(a<=0){r(x=>({...x,isLive:!0}));return}const m=Math.floor(a/864e5),g=Math.floor(a%864e5/36e5),p=Math.floor(a%36e5/6e4),h=Math.floor(a%6e4/1e3);r({days:String(m).padStart(2,"0"),hours:String(g).padStart(2,"0"),mins:String(p).padStart(2,"0"),secs:String(h).padStart(2,"0"),isLive:!1})};s();const c=setInterval(s,1e3),d=document.querySelectorAll(".fade-in"),t=new IntersectionObserver(i=>{i.forEach(a=>{a.isIntersecting&&a.target.classList.add("visible")})},{threshold:.12});return d.forEach(i=>t.observe(i)),()=>{clearInterval(c),t.disconnect()}},[]),e.jsxs("div",{className:"landing-page-container",children:[e.jsxs(f,{children:[e.jsx("title",{children:"Tocorimerio — Fluminense vs Bolívar | Copa Libertadores 2026"}),e.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;1,400&family=Barlow:wght@400;500&display=swap",rel:"stylesheet"}),e.jsx("style",{children:`
            :root {
              --green: #1a7a2e;
              --green-light: #2ecc5a;
              --garnet: #8b0000;
              --garnet-light: #c0392b;
              --gold: #d4a843;
              --gold-light: #f0c84a;
              --cream: #f5f0e8;
              --dark: #0a0a0a;
              --dark-2: #111111;
              --dark-3: #1a1a1a;
              --mid: #2a2a2a;
              --text: #e8e0d0;
              --text-dim: #888880;
            }

            .landing-page-container {
              background: var(--dark);
              color: var(--text);
              font-family: 'Barlow', sans-serif;
              overflow-x: hidden;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            .landing-page-container * { box-sizing: border-box; }

            /* ── NAV ── */
            .landing-page-container nav {
              position: fixed; top: 0; left: 0; right: 0; z-index: 100;
              display: flex; justify-content: space-between; align-items: center;
              padding: 1rem 2.5rem;
              background: rgba(10,10,10,0.85);
              backdrop-filter: blur(12px);
              border-bottom: 1px solid rgba(212,168,67,0.2);
            }
            .landing-page-container .logo {
              font-family: 'Bebas Neue', sans-serif;
              font-size: 1.7rem;
              letter-spacing: 0.12em;
              color: var(--gold);
            }
            .landing-page-container .logo span { color: var(--green-light); }
            .landing-page-container nav a {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.9rem;
              font-weight: 600;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: var(--text-dim);
              text-decoration: none;
              transition: color 0.2s;
            }
            .landing-page-container nav a:hover { color: var(--gold); }
            .landing-page-container .nav-links { display: flex; gap: 2rem; align-items: center; }
            .landing-page-container .nav-cta {
              background: var(--green);
              color: #fff !important;
              padding: 0.5rem 1.2rem;
              border-radius: 2px;
            }
            .landing-page-container .nav-cta:hover { background: var(--green-light) !important; color: var(--dark) !important; }

            /* ── HERO ── */
            .landing-page-container .hero {
              min-height: 100vh;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              padding: 6rem 1.5rem 4rem;
              overflow: hidden;
            }

            .landing-page-container .hero-bg {
              position: absolute; inset: 0; z-index: 0;
              background:
                radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,122,46,0.18) 0%, transparent 60%),
                radial-gradient(ellipse 60% 40% at 20% 80%, rgba(139,0,0,0.15) 0%, transparent 50%),
                radial-gradient(ellipse 50% 50% at 80% 60%, rgba(212,168,67,0.08) 0%, transparent 50%),
                linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%);
            }

            /* Stadium arc lines */
            .landing-page-container .hero-bg::before {
              content: '';
              position: absolute; inset: 0;
              background-image:
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 48px,
                  rgba(255,255,255,0.02) 48px,
                  rgba(255,255,255,0.02) 49px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 48px,
                  rgba(255,255,255,0.015) 48px,
                  rgba(255,255,255,0.015) 49px
                );
            }

            .landing-page-container .competition-badge {
              position: relative; z-index: 2;
              display: inline-flex; align-items: center; gap: 0.6rem;
              background: rgba(212,168,67,0.12);
              border: 1px solid rgba(212,168,67,0.35);
              padding: 0.4rem 1rem;
              border-radius: 100px;
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.78rem;
              font-weight: 600;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--gold-light);
              margin-bottom: 2rem;
              animation: fadeDown 0.8s ease both;
            }
            .landing-page-container .badge-dot {
              width: 6px; height: 6px;
              background: var(--gold);
              border-radius: 50%;
              animation: pulse 1.5s ease infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(0.7); }
            }

            .landing-page-container .match-header {
              position: relative; z-index: 2;
              display: flex;
              align-items: center;
              gap: 1.5rem;
              margin-bottom: 1.8rem;
              animation: fadeDown 0.8s 0.15s ease both;
            }

            .landing-page-container .team-block { text-align: center; }
            .landing-page-container .team-name {
              font-family: 'Bebas Neue', sans-serif;
              font-size: clamp(2.5rem, 7vw, 5.5rem);
              line-height: 1;
              letter-spacing: 0.05em;
            }
            .landing-page-container .team-name.flu { color: var(--green-light); }
            .landing-page-container .team-name.blv { color: var(--cream); opacity: 0.85; }
            .landing-page-container .team-sub {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.75rem;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: var(--text-dim);
              margin-top: 0.3rem;
            }

            .landing-page-container .vs-block {
              display: flex; flex-direction: column; align-items: center;
              gap: 0.4rem;
            }
            .landing-page-container .vs-text {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 1.1rem;
              font-weight: 700;
              letter-spacing: 0.25em;
              color: var(--gold);
              text-transform: uppercase;
            }
            .landing-page-container .vs-divider {
              width: 1px; height: 50px;
              background: linear-gradient(180deg, transparent, var(--gold), transparent);
            }

            .landing-page-container .hero-headline {
              position: relative; z-index: 2;
              font-family: 'Bebas Neue', sans-serif;
              font-size: clamp(1.2rem, 3.5vw, 2rem);
              letter-spacing: 0.12em;
              color: var(--text-dim);
              text-transform: uppercase;
              margin-bottom: 0.8rem;
              animation: fadeDown 0.8s 0.25s ease both;
            }

            .landing-page-container .match-meta {
              position: relative; z-index: 2;
              display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
              margin-bottom: 3rem;
              animation: fadeDown 0.8s 0.35s ease both;
            }
            .landing-page-container .meta-item {
              display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
            }
            .landing-page-container .meta-label {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.65rem;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: var(--text-dim);
            }
            .landing-page-container .meta-value {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 1rem;
              font-weight: 700;
              letter-spacing: 0.08em;
              color: var(--cream);
            }

            /* ── COUNTDOWN ── */
            .landing-page-container .countdown {
              position: relative; z-index: 2;
              display: flex; gap: 0.4rem;
              margin-bottom: 3rem;
              animation: fadeDown 0.8s 0.45s ease both;
            }
            .landing-page-container .cd-block {
              display: flex; flex-direction: column; align-items: center;
              background: rgba(255,255,255,0.04);
              border: 1px solid rgba(255,255,255,0.08);
              padding: 0.9rem 1.2rem;
              min-width: 72px;
            }
            .landing-page-container .cd-num {
              font-family: 'Bebas Neue', sans-serif;
              font-size: 2.4rem;
              line-height: 1;
              color: var(--gold-light);
            }
            .landing-page-container .cd-label {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.6rem;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: var(--text-dim);
              margin-top: 0.2rem;
            }
            .landing-page-container .cd-sep {
              font-family: 'Bebas Neue', sans-serif;
              font-size: 2.4rem;
              color: var(--text-dim);
              align-self: flex-start;
              padding-top: 0.9rem;
              opacity: 0.4;
            }

            .landing-page-container .hero-ctas {
              position: relative; z-index: 2;
              display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
              animation: fadeDown 0.8s 0.55s ease both;
            }
            .landing-page-container .btn-primary {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 1rem;
              font-weight: 700;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              padding: 1rem 2.5rem;
              background: var(--green);
              color: #fff;
              border: none; cursor: pointer; text-decoration: none;
              transition: all 0.2s;
              position: relative;
              overflow: hidden;
            }
            .landing-page-container .btn-primary::after {
              content: '';
              position: absolute; inset: 0;
              background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
            }
            .landing-page-container .btn-primary:hover { background: var(--green-light); color: var(--dark); transform: translateY(-2px); }
            .landing-page-container .btn-secondary {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 1rem;
              font-weight: 600;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              padding: 1rem 2rem;
              background: transparent;
              color: var(--text);
              border: 1px solid rgba(255,255,255,0.2);
              cursor: pointer; text-decoration: none;
              transition: all 0.2s;
            }
            .landing-page-container .btn-secondary:hover { border-color: var(--gold); color: var(--gold); }

            .landing-page-container .scroll-hint {
              position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
              z-index: 2;
              display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
              opacity: 0.4;
              animation: bounce 2s ease infinite;
            }
            .landing-page-container .scroll-hint span {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
            }
            .landing-page-container .scroll-arrow {
              width: 18px; height: 18px;
              border-right: 2px solid currentColor;
              border-bottom: 2px solid currentColor;
              transform: rotate(45deg);
            }

            @keyframes bounce {
              0%, 100% { transform: translateX(-50%) translateY(0); }
              50% { transform: translateX(-50%) translateY(6px); }
            }

            /* ── URGENCY BANNER ── */
            .landing-page-container .urgency-bar {
              background: linear-gradient(90deg, var(--garnet) 0%, #a01010 50%, var(--garnet) 100%);
              padding: 0.8rem 1.5rem;
              text-align: center;
              display: flex; justify-content: center; align-items: center; gap: 1rem;
              flex-wrap: wrap;
            }
            .landing-page-container .urgency-bar p {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.9rem;
              font-weight: 600;
              letter-spacing: 0.1em;
              text-transform: uppercase;
            }
            .landing-page-container .urgency-highlight { color: var(--gold-light); }

            /* ── PACKAGES ── */
            .landing-page-container section { padding: 5rem 2rem; }
            .landing-page-container .section-label {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.75rem;
              font-weight: 600;
              letter-spacing: 0.25em;
              text-transform: uppercase;
              color: var(--gold);
              margin-bottom: 0.8rem;
            }
            .landing-page-container .section-title {
              font-family: 'Bebas Neue', sans-serif;
              font-size: clamp(2.2rem, 5vw, 3.5rem);
              letter-spacing: 0.06em;
              line-height: 1;
              margin-bottom: 1rem;
            }
            .landing-page-container .section-sub {
              font-size: 1rem;
              color: var(--text-dim);
              max-width: 520px;
              line-height: 1.65;
            }

            .landing-page-container .packages-section { background: var(--dark-2); }
            .landing-page-container .packages-header { text-align: center; margin-bottom: 3.5rem; }
            .landing-page-container .packages-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
              gap: 1.5px;
              max-width: 1100px; margin: 0 auto;
              background: rgba(255,255,255,0.06);
            }

            .landing-page-container .pkg-card {
              background: var(--dark-2);
              padding: 2.5rem 2rem;
              position: relative;
              transition: background 0.3s;
              cursor: default;
            }
            .landing-page-container .pkg-card:hover { background: var(--dark-3); }
            .landing-page-container .pkg-card.featured {
              background: linear-gradient(160deg, rgba(26,122,46,0.12) 0%, var(--dark-2) 60%);
              border-top: 3px solid var(--green-light);
            }
            .landing-page-container .pkg-badge {
              position: absolute; top: 0; right: 2rem;
              background: var(--green-light); color: var(--dark);
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.65rem;
              font-weight: 700;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              padding: 0.25rem 0.6rem;
              transform: translateY(-50%);
            }
            .landing-page-container .pkg-tier {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.7rem;
              font-weight: 700;
              letter-spacing: 0.25em;
              text-transform: uppercase;
              color: var(--text-dim);
              margin-bottom: 0.5rem;
            }
            .landing-page-container .pkg-name {
              font-family: 'Bebas Neue', sans-serif;
              font-size: 1.8rem;
              letter-spacing: 0.1em;
              color: var(--cream);
              margin-bottom: 0.3rem;
            }
            .landing-page-container .pkg-price {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 2.2rem;
              font-weight: 700;
              color: var(--gold-light);
              line-height: 1;
              margin-bottom: 0.2rem;
            }
            .landing-page-container .pkg-price sub {
              font-size: 1rem;
              vertical-align: baseline;
              color: var(--text-dim);
            }
            .landing-page-container .pkg-per {
              font-size: 0.8rem;
              color: var(--text-dim);
              margin-bottom: 1.5rem;
            }
            .landing-page-container .pkg-divider {
              height: 1px;
              background: rgba(255,255,255,0.07);
              margin-bottom: 1.5rem;
            }
            .landing-page-container .pkg-features { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; }
            .landing-page-container .pkg-features li {
              display: flex; gap: 0.7rem; align-items: flex-start;
              font-size: 0.9rem; color: var(--text-dim); line-height: 1.4;
            }
            .landing-page-container .pkg-features li .check {
              color: var(--green-light);
              font-size: 0.75rem;
              font-weight: 700;
              flex-shrink: 0;
              margin-top: 0.15rem;
            }
            .landing-page-container .pkg-features li.inactive { opacity: 0.3; text-decoration: line-through; }
            .landing-page-container .pkg-cta {
              display: block; width: 100%;
              margin-top: 2rem;
              padding: 0.85rem;
              text-align: center;
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.9rem;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              text-decoration: none;
              transition: all 0.2s;
            }
            .landing-page-container .pkg-cta.green { background: var(--green); color: #fff; }
            .landing-page-container .pkg-cta.green:hover { background: var(--green-light); color: var(--dark); }
            .landing-page-container .pkg-cta.outline { border: 1px solid rgba(255,255,255,0.2); color: var(--text); }
            .landing-page-container .pkg-cta.outline:hover { border-color: var(--gold); color: var(--gold); }

            /* ── WHAT'S INCLUDED ── */
            .landing-page-container .included-section { background: var(--dark); }
            .landing-page-container .included-layout {
              max-width: 1100px; margin: 0 auto;
              display: grid; grid-template-columns: 1fr 1fr; gap: 5rem;
              align-items: start;
            }
            @media (max-width: 768px) {
              .landing-page-container .included-layout { grid-template-columns: 1fr; gap: 3rem; }
            }
            .landing-page-container .included-list { display: flex; flex-direction: column; gap: 1.8rem; }
            .landing-page-container .included-item {
              display: flex; gap: 1.2rem; align-items: flex-start;
            }
            .landing-page-container .included-icon {
              width: 42px; height: 42px; flex-shrink: 0;
              background: rgba(46,204,90,0.1);
              border: 1px solid rgba(46,204,90,0.2);
              display: flex; align-items: center; justify-content: center;
              font-size: 1.1rem;
            }
            .landing-page-container .included-text h4 {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 1rem;
              font-weight: 700;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: var(--cream);
              margin-bottom: 0.3rem;
            }
            .landing-page-container .included-text p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.55; }

            /* ── MATCHDAY URGENCY ── */
            .landing-page-container .stakes-section {
              background: linear-gradient(135deg, rgba(139,0,0,0.25) 0%, rgba(10,10,10,0.9) 50%, rgba(26,122,46,0.15) 100%),
                          var(--dark-3);
              text-align: center; padding: 5rem 2rem;
            }
            .landing-page-container .stakes-section .section-title { font-size: clamp(2.5rem, 6vw, 4.5rem); }
            .landing-page-container .stakes-lead {
              max-width: 660px; margin: 1.5rem auto 2.5rem;
              font-size: 1.05rem;
              line-height: 1.7;
              color: var(--text-dim);
            }
            .landing-page-container .stakes-lead strong { color: var(--gold-light); }

            /* ── REVIEWS ── */
            .landing-page-container .reviews-section { background: var(--dark-2); }
            .landing-page-container .reviews-header { text-align: center; margin-bottom: 3rem; }
            .landing-page-container .stars {
              color: var(--gold);
              font-size: 1.1rem;
              letter-spacing: 0.1em;
              margin-bottom: 0.5rem;
            }
            .landing-page-container .reviews-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
              gap: 1.5px; max-width: 1000px; margin: 0 auto;
              background: rgba(255,255,255,0.06);
            }
            .landing-page-container .review-card {
              background: var(--dark-2);
              padding: 1.8rem;
            }
            .landing-page-container .review-stars { color: var(--gold); font-size: 0.8rem; margin-bottom: 0.8rem; }
            .landing-page-container .review-text {
              font-size: 0.88rem;
              line-height: 1.65;
              color: var(--text-dim);
              margin-bottom: 1.2rem;
              font-style: italic;
            }
            .landing-page-container .review-author {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.8rem;
              font-weight: 700;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: var(--cream);
            }
            .landing-page-container .review-country { color: var(--text-dim); font-weight: 400; }
            .landing-page-container .review-badge {
              display: flex; align-items: center; gap: 1rem;
              justify-content: center; margin-top: 3rem;
            }
            .landing-page-container .review-badge .big-num {
              font-family: 'Bebas Neue', sans-serif;
              font-size: 4rem; line-height: 1;
              color: var(--gold);
            }
            .landing-page-container .review-badge .badge-text p:first-child {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.75rem;
              font-weight: 700; letter-spacing: 0.2em;
              text-transform: uppercase; color: var(--text-dim);
            }
            .landing-page-container .review-badge .badge-text p:last-child {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.85rem; color: var(--cream);
            }

            /* ── HOW IT WORKS ── */
            .landing-page-container .how-section { background: var(--dark); }
            .landing-page-container .steps-row {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 0; max-width: 1000px; margin: 3rem auto 0;
            }
            .landing-page-container .step {
              padding: 2rem 1.5rem;
              border-left: 1px solid rgba(255,255,255,0.06);
              position: relative;
            }
            .landing-page-container .step:first-child { border-left: none; }
            .landing-page-container .step-num {
              font-family: 'Bebas Neue', sans-serif;
              font-size: 3.5rem; line-height: 1;
              color: rgba(212,168,67,0.15);
              position: absolute; top: 1rem; right: 1rem;
            }
            .landing-page-container .step-icon { font-size: 1.6rem; margin-bottom: 1rem; }
            .landing-page-container .step h4 {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 1rem; font-weight: 700;
              letter-spacing: 0.08em; text-transform: uppercase;
              color: var(--cream); margin-bottom: 0.5rem;
            }
            .landing-page-container .step p { font-size: 0.83rem; color: var(--text-dim); line-height: 1.55; }

            /* ── FINAL CTA ── */
            .landing-page-container .final-cta {
              background:
                radial-gradient(ellipse 80% 60% at 50% 100%, rgba(26,122,46,0.2) 0%, transparent 60%),
                var(--dark-3);
              text-align: center;
              padding: 6rem 2rem;
            }
            .landing-page-container .final-cta .section-title { font-size: clamp(2.5rem, 6vw, 5rem); }
            .landing-page-container .cta-price-row {
              margin: 2rem 0 2.5rem;
              font-family: 'Barlow Condensed', sans-serif;
            }
            .landing-page-container .cta-price-row .from { font-size: 0.9rem; color: var(--text-dim); letter-spacing: 0.1em; }
            .landing-page-container .cta-price-row .amount {
              font-size: 3rem; font-weight: 700;
              color: var(--gold-light); line-height: 1;
            }
            .landing-page-container .cta-note { font-size: 0.8rem; color: var(--text-dim); margin-top: 1.5rem; }

            /* ── FOOTER ── */
            .landing-page-container footer {
              background: var(--dark);
              border-top: 1px solid rgba(255,255,255,0.06);
              padding: 2.5rem 2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 1.5rem;
            }
            .landing-page-container footer .logo { font-size: 1.3rem; }
            .landing-page-container .footer-links {
              display: flex; gap: 1.5rem; flex-wrap: wrap;
            }
            .landing-page-container .footer-links a {
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 0.75rem;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: var(--text-dim);
              text-decoration: none;
              transition: color 0.2s;
            }
            .landing-page-container .footer-links a:hover { color: var(--gold); }
            .landing-page-container .footer-copy {
              font-size: 0.75rem;
              color: var(--text-dim);
              opacity: 0.5;
            }

            /* ── ANIMATIONS ── */
            @keyframes fadeDown {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .landing-page-container .fade-in {
              opacity: 0;
              transform: translateY(24px);
              transition: opacity 0.7s ease, transform 0.7s ease;
            }
            .landing-page-container .fade-in.visible {
              opacity: 1;
              transform: none;
            }

            /* ── RESPONSIVE ── */
            @media (max-width: 600px) {
              .landing-page-container nav { padding: 0.9rem 1.2rem; }
              .landing-page-container .nav-links { gap: 1rem; }
              .landing-page-container .match-header { gap: 0.8rem; }
              .landing-page-container .countdown { gap: 0.3rem; }
              .landing-page-container .cd-block { min-width: 58px; padding: 0.7rem 0.8rem; }
              .landing-page-container .cd-num { font-size: 2rem; }
              .landing-page-container .step { border-left: none; border-top: 1px solid rgba(255,255,255,0.06); }
              .landing-page-container .step:first-child { border-top: none; }
            }
          `})]}),e.jsxs("nav",{children:[e.jsxs("div",{className:"logo",children:["Tocori",e.jsx("span",{children:"merio"})]}),e.jsxs("div",{className:"nav-links",children:[e.jsx("a",{href:"#packages",children:"Packages"}),e.jsx("a",{href:"#included",children:"What's Included"}),e.jsx("a",{href:"#packages",className:"nav-cta",children:"Book Now"})]})]}),e.jsxs("section",{className:"hero",children:[e.jsx("div",{className:"hero-bg"}),e.jsxs("div",{className:"competition-badge",children:[e.jsx("span",{className:"badge-dot"}),"CONMEBOL Libertadores 2026 · Group C"]}),e.jsxs("div",{className:"match-header",children:[e.jsxs("div",{className:"team-block",children:[e.jsx("div",{className:"team-name flu",children:"Fluminense"}),e.jsx("div",{className:"team-sub",children:"Rio de Janeiro · BRA"})]}),e.jsxs("div",{className:"vs-block",children:[e.jsx("div",{className:"vs-divider"}),e.jsx("div",{className:"vs-text",children:"VS"}),e.jsx("div",{className:"vs-divider"})]}),e.jsxs("div",{className:"team-block",children:[e.jsx("div",{className:"team-name blv",children:"Bolívar"}),e.jsx("div",{className:"team-sub",children:"La Paz · BOL"})]})]}),e.jsx("div",{className:"hero-headline",children:"Live at Maracanã — The Cathedral of Football"}),e.jsxs("div",{className:"match-meta",children:[e.jsxs("div",{className:"meta-item",children:[e.jsx("span",{className:"meta-label",children:"Date"}),e.jsx("span",{className:"meta-value",children:"Tue, May 19 · 2026"})]}),e.jsxs("div",{className:"meta-item",children:[e.jsx("span",{className:"meta-label",children:"Kickoff"}),e.jsx("span",{className:"meta-value",children:"21:30 BRT"})]}),e.jsxs("div",{className:"meta-item",children:[e.jsx("span",{className:"meta-label",children:"Venue"}),e.jsx("span",{className:"meta-value",children:"Estádio do Maracanã"})]}),e.jsxs("div",{className:"meta-item",children:[e.jsx("span",{className:"meta-label",children:"Stage"}),e.jsx("span",{className:"meta-value",children:"Group C · Matchday 5"})]})]}),n.isLive?e.jsx("div",{className:"countdown",children:e.jsx("p",{style:{fontFamily:"'Barlow Condensed', sans-serif",fontSize:"1.4rem",letterSpacing:"0.2em",color:"var(--gold)"},children:"MATCH IS LIVE 🔴"})}):e.jsxs("div",{className:"countdown",children:[e.jsxs("div",{className:"cd-block",children:[e.jsx("div",{className:"cd-num",children:n.days}),e.jsx("div",{className:"cd-label",children:"Days"})]}),e.jsx("div",{className:"cd-sep",children:":"}),e.jsxs("div",{className:"cd-block",children:[e.jsx("div",{className:"cd-num",children:n.hours}),e.jsx("div",{className:"cd-label",children:"Hours"})]}),e.jsx("div",{className:"cd-sep",children:":"}),e.jsxs("div",{className:"cd-block",children:[e.jsx("div",{className:"cd-num",children:n.mins}),e.jsx("div",{className:"cd-label",children:"Mins"})]}),e.jsx("div",{className:"cd-sep",children:":"}),e.jsxs("div",{className:"cd-block",children:[e.jsx("div",{className:"cd-num",children:n.secs}),e.jsx("div",{className:"cd-label",children:"Secs"})]})]}),e.jsxs("div",{className:"hero-ctas",children:[e.jsx("a",{href:"#packages",className:"btn-primary",children:"Get My Tickets"}),e.jsx("a",{href:"#included",className:"btn-secondary",children:"See What's Included"})]}),e.jsxs("div",{className:"scroll-hint",children:[e.jsx("span",{children:"Scroll"}),e.jsx("div",{className:"scroll-arrow"})]})]}),e.jsx("div",{className:"urgency-bar",children:e.jsxs("p",{children:["🔴 ",e.jsx("span",{className:"urgency-highlight",children:"MUST-WIN"})," — Fluminense need a ",e.jsx("span",{className:"urgency-highlight",children:"3-goal margin"})," to advance. Don't miss the most intense Maracanã night of 2026."]})}),e.jsxs("section",{className:"packages-section",id:"packages",children:[e.jsxs("div",{className:"packages-header fade-in",children:[e.jsx("div",{className:"section-label",children:"Choose Your Experience"}),e.jsx("div",{className:"section-title",children:"Match Day Packages"}),e.jsx("p",{className:"section-sub",style:{margin:"0 auto"},children:"Every package includes your official ticket, English-speaking guide, and pre-match transfer from Ipanema or Copacabana."})]}),e.jsxs("div",{className:"packages-grid fade-in",children:[e.jsxs("div",{className:"pkg-card",children:[e.jsx("div",{className:"pkg-tier",children:"Starter"}),e.jsx("div",{className:"pkg-name",children:"Essential"}),e.jsxs("div",{className:"pkg-price",children:[e.jsx("sub",{children:"USD "}),"79"]}),e.jsx("div",{className:"pkg-per",children:"per person"}),e.jsx("div",{className:"pkg-divider"}),e.jsxs("ul",{className:"pkg-features",children:[e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Official match ticket (lower tier)"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Round-trip transfer (Ipanema / Copa)"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," English-speaking local guide"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Stadium entry briefing"]}),e.jsxs("li",{className:"inactive",children:[e.jsx("span",{className:"check",children:"—"})," Premium seating section"]}),e.jsxs("li",{className:"inactive",children:[e.jsx("span",{className:"check",children:"—"})," Pre-match bar meetup"]})]}),e.jsx("a",{href:"#",className:"pkg-cta outline",children:"Select Essential"})]}),e.jsxs("div",{className:"pkg-card featured",children:[e.jsx("div",{className:"pkg-badge",children:"Most Popular"}),e.jsx("div",{className:"pkg-tier",children:"Recommended"}),e.jsx("div",{className:"pkg-name",children:"Full Experience"}),e.jsxs("div",{className:"pkg-price",children:[e.jsx("sub",{children:"USD "}),"129"]}),e.jsx("div",{className:"pkg-per",children:"per person"}),e.jsx("div",{className:"pkg-divider"}),e.jsxs("ul",{className:"pkg-features",children:[e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Official match ticket (premium lower tier)"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Round-trip transfer (Ipanema / Copa)"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," English-speaking local guide"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Pre-match bar meetup with the group"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Brazilian snacks & local beer included"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Matchday digital booklet"]})]}),e.jsx("a",{href:"#",className:"pkg-cta green",children:"Select Full Experience"})]}),e.jsxs("div",{className:"pkg-card",children:[e.jsx("div",{className:"pkg-tier",children:"Premium"}),e.jsx("div",{className:"pkg-name",children:"VIP Platinum"}),e.jsxs("div",{className:"pkg-price",children:[e.jsx("sub",{children:"USD "}),"219"]}),e.jsx("div",{className:"pkg-per",children:"per person"}),e.jsx("div",{className:"pkg-divider"}),e.jsxs("ul",{className:"pkg-features",children:[e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Official ticket — best seats in the stadium"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Private transfer (dedicated vehicle)"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Personal guide (max 4 per guide)"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Private pre-match dinner in Urca"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Premium bar package (open tab)"]}),e.jsxs("li",{children:[e.jsx("span",{className:"check",children:"✓"})," Exclusive Fluminense matchday scarf"]})]}),e.jsx("a",{href:"#",className:"pkg-cta outline",children:"Select VIP Platinum"})]})]})]}),e.jsx("section",{className:"included-section",id:"included",children:e.jsxs("div",{className:"included-layout",children:[e.jsxs("div",{className:"fade-in",children:[e.jsx("div",{className:"section-label",children:"The Tocorimerio Way"}),e.jsxs("div",{className:"section-title",children:["Everything ",e.jsx("br",{}),"Handled."]}),e.jsx("p",{className:"section-sub",children:"We've been taking travellers to Brazilian football since the very beginning. You just show up — we do the rest."})]}),e.jsxs("div",{className:"included-list fade-in",children:[e.jsxs("div",{className:"included-item",children:[e.jsx("div",{className:"included-icon",children:"🎟️"}),e.jsxs("div",{className:"included-text",children:[e.jsx("h4",{children:"Official Tickets"}),e.jsx("p",{children:"Guaranteed authentic, seated tickets — no third-party resellers or scalper risk. Your seat is confirmed before you book."})]})]}),e.jsxs("div",{className:"included-item",children:[e.jsx("div",{className:"included-icon",children:"🚌"}),e.jsxs("div",{className:"included-text",children:[e.jsx("h4",{children:"Round-Trip Transfer"}),e.jsx("p",{children:"Comfortable, air-conditioned pickup from Ipanema or Copacabana. We navigate traffic so you don't have to."})]})]}),e.jsxs("div",{className:"included-item",children:[e.jsx("div",{className:"included-icon",children:"🗣️"}),e.jsxs("div",{className:"included-text",children:[e.jsx("h4",{children:"English-Speaking Guide"}),e.jsx("p",{children:"A passionate local football fan walks you through the rituals, chants, history and madness of Flu at the Maracanã."})]})]}),e.jsxs("div",{className:"included-item",children:[e.jsx("div",{className:"included-icon",children:"🍺"}),e.jsxs("div",{className:"included-text",children:[e.jsx("h4",{children:"Pre-Match Meetup"}),e.jsx("p",{children:"Join your group at a local bar near the stadium. Cold chopp, street food, and genuine tricolor atmosphere."})]})]}),e.jsxs("div",{className:"included-item",children:[e.jsx("div",{className:"included-icon",children:"🛡️"}),e.jsxs("div",{className:"included-text",children:[e.jsx("h4",{children:"Safety & Peace of Mind"}),e.jsx("p",{children:"We know the city. From the moment you're picked up to when you're dropped back, you're in safe hands."})]})]})]})]})}),e.jsxs("section",{className:"stakes-section fade-in",children:[e.jsx("div",{className:"section-label",children:"Why This Match Matters"}),e.jsxs("div",{className:"section-title",children:["A Night of High Stakes",e.jsx("br",{}),"at the Maracanã"]}),e.jsxs("p",{className:"stakes-lead",children:["Fluminense must win — and win ",e.jsx("strong",{children:"big"}),". After falling 2–0 in La Paz, the Tricolor need at least a ",e.jsx("strong",{children:"3-goal margin"})," to leapfrog Bolívar on head-to-head. With 78,000 fans roaring under the Maracanã lights, this is Copa Libertadores football at its most dramatic."]}),e.jsx("a",{href:"#packages",className:"btn-primary",children:"I Want to Be There"})]}),e.jsxs("section",{className:"how-section",children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"0.5rem"},className:"fade-in",children:[e.jsx("div",{className:"section-label",children:"Simple Process"}),e.jsx("div",{className:"section-title",children:"How It Works"})]}),e.jsxs("div",{className:"steps-row fade-in",children:[e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-num",children:"01"}),e.jsx("div",{className:"step-icon",children:"📋"}),e.jsx("h4",{children:"Book Online"}),e.jsx("p",{children:"Choose your package and complete checkout in under 3 minutes. Instant confirmation email."})]}),e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-num",children:"02"}),e.jsx("div",{className:"step-icon",children:"📍"}),e.jsx("h4",{children:"We Pick You Up"}),e.jsx("p",{children:"Your guide meets you at your hotel or designated Ipanema / Copacabana pickup point."})]}),e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-num",children:"03"}),e.jsx("div",{className:"step-icon",children:"🍺"}),e.jsx("h4",{children:"Pre-Match Vibes"}),e.jsx("p",{children:"Join the group for food, drinks and pre-match energy at a local favourite near the stadium."})]}),e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-num",children:"04"}),e.jsx("div",{className:"step-icon",children:"⚽"}),e.jsx("h4",{children:"The Beautiful Game"}),e.jsx("p",{children:"Experience Copa Libertadores football live inside the greatest stadium in South America."})]}),e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-num",children:"05"}),e.jsx("div",{className:"step-icon",children:"🏠"}),e.jsx("h4",{children:"Safe Return"}),e.jsx("p",{children:"We bring you back after the final whistle, relaxed and with memories to last a lifetime."})]})]})]}),e.jsxs("section",{className:"reviews-section",children:[e.jsxs("div",{className:"reviews-header fade-in",children:[e.jsx("div",{className:"section-label",children:"What People Say"}),e.jsx("div",{className:"section-title",children:"Real Reviews"}),e.jsxs("div",{className:"review-badge",children:[e.jsx("div",{className:"big-num",children:"5.0"}),e.jsxs("div",{className:"badge-text",children:[e.jsx("p",{children:"Google Rating"}),e.jsx("p",{children:"1,090+ verified reviews ★★★★★"})]})]})]}),e.jsxs("div",{className:"reviews-grid fade-in",children:[e.jsxs("div",{className:"review-card",children:[e.jsx("div",{className:"review-stars",children:"★★★★★"}),e.jsx("p",{className:"review-text",children:'"Absolutely unforgettable. The guide knew everything — the history, the chants, where to sit for the best view. Flu scored twice in injury time and I cried. 10/10 would do again."'}),e.jsxs("div",{className:"review-author",children:["James H. ",e.jsx("span",{className:"review-country",children:"· United Kingdom"})]})]}),e.jsxs("div",{className:"review-card",children:[e.jsx("div",{className:"review-stars",children:"★★★★★"}),e.jsx("p",{className:"review-text",children:`"I was nervous about going alone as a solo traveller. The team made it so easy. I ended up befriending locals, shared beer and sang like I'd been a Flu fan for years."`}),e.jsxs("div",{className:"review-author",children:["Sofia M. ",e.jsx("span",{className:"review-country",children:"· Germany"})]})]}),e.jsxs("div",{className:"review-card",children:[e.jsx("div",{className:"review-stars",children:"★★★★★"}),e.jsx("p",{className:"review-text",children:`"The transfer was super comfortable and the guide was hilarious and incredibly knowledgeable. Seeing Maracanã at night lit up for a Libertadores match — there's nothing like it."`}),e.jsxs("div",{className:"review-author",children:["Daniel K. ",e.jsx("span",{className:"review-country",children:"· United States"})]})]})]})]}),e.jsxs("section",{className:"final-cta fade-in",children:[e.jsx("div",{className:"section-label",children:"Limited Availability"}),e.jsxs("div",{className:"section-title",children:["Don't Miss",e.jsx("br",{}),"May 19"]}),e.jsxs("div",{className:"cta-price-row",children:[e.jsx("div",{className:"from",children:"Packages from"}),e.jsx("div",{className:"amount",children:"USD 79"})]}),e.jsx("a",{href:"#packages",className:"btn-primary",style:{fontSize:"1.1rem",padding:"1.1rem 3rem"},children:"Secure My Spot Now"}),e.jsx("p",{className:"cta-note",children:"Instant confirmation · Secure payment · Free cancellation up to 72h before"})]}),e.jsxs("footer",{children:[e.jsxs("div",{className:"logo",children:["Tocori",e.jsx("span",{children:"merio"})]}),e.jsxs("div",{className:"footer-links",children:[e.jsx("a",{href:"#",children:"About"}),e.jsx("a",{href:"#",children:"FAQ"}),e.jsx("a",{href:"#",children:"Contact"}),e.jsx("a",{href:"#",children:"Terms"}),e.jsx("a",{href:"#",children:"Privacy"})]}),e.jsx("div",{className:"footer-copy",children:"© 2026 Tocorimerio.com · Rio de Janeiro"})]})]})};export{u as default};
