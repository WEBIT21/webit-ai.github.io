/**
 * Webit AI Chatbot v3 Pro
 * ─────────────────────────────────────────────────────────────
 * CONFIGURATION REQUISE (2 étapes) :
 *
 * 1. Déployer worker.js sur Cloudflare Workers (gratuit)
 *    → Remplacer workerUrl ci-dessous par l'URL de ton Worker
 *
 * 2. Créer un compte gratuit sur https://web3forms.com
 *    → Entrer contact@webit-ai.com → Copier la clé reçue par email
 *    → Remplacer web3formsKey ci-dessous
 * ─────────────────────────────────────────────────────────────
 */
const CHATBOT_CONFIG = {
  workerUrl:    'VOTRE_WORKER_URL',     // ex: https://webit-chatbot.monpseudo.workers.dev
  web3formsKey: 'VOTRE_WEB3FORMS_KEY', // ex: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  colors: {
    primary:   '#3A75C4',
    secondary: '#009E60',
    accent:    '#FCD116'
  }
};

const AI_ON    = CHATBOT_CONFIG.workerUrl    && !CHATBOT_CONFIG.workerUrl.startsWith('VOTRE');
const FORMS_ON = CHATBOT_CONFIG.web3formsKey && !CHATBOT_CONFIG.web3formsKey.startsWith('VOTRE');

const LEAD_REGEX = /\b(devis|tarif|prix|coût|cout|budget|rappel|contacter|offre|propositi|interest|renseignement|contact|demande|infos?)\b/i;

const SERVICES = [
  'Administration Système',
  'Infrastructure Réseau',
  'Sécurité Informatique (Fortinet)',
  'WiFi Professionnel',
  'Vidéosurveillance IP',
  'Cloud & Automatisation',
  'Intégration Starlink Business',
  'Infogérance (contrat MSP)',
  'Plusieurs services / Autre'
];

// ─── Base de connaissances locale (fallback si Worker non configuré) ───────────

const KB_SERVICES = {
  systeme:   { t: 'Administration Système',        d: 'Windows Server, AD, Linux (RedHat/Ubuntu/CentOS), VMware, Hyper-V, Proxmox, monitoring, sauvegardes/PRA.' },
  reseau:    { t: 'Infrastructure Réseau',         d: 'LAN/WAN, VLAN, Cisco, Aruba, HP, VPN multi-sites, SD-WAN, F5 Load Balancing.' },
  securite:  { t: 'Sécurité Informatique',        d: 'Fortinet FortiGate (Integrator Partner certifié), Palo Alto, EDR SentinelOne/Wazuh, audits, RGPD, ISO27001.' },
  wifi:      { t: 'WiFi Professionnel',           d: 'Site Survey Ekahau, Aruba, Cisco Meraki, Ruckus, 802.1X, portail captif, Aruba Central.' },
  video:     { t: 'Vidéosurveillance IP',         d: 'Caméras 4K/8MP PTZ et fixes, NVR, analyse vidéo IA, accès distant sécurisé.' },
  cloud:     { t: 'Cloud & Automatisation',       d: 'Azure, AWS, GCP, Ansible/AWX, Terraform, Infrastructure as Code, DevOps, CI/CD.' },
  starlink:  { t: 'Intégration Starlink Business', d: 'Étude de site, montage & orientation terminal, câblage, protection électrique. France (Île-de-France) & Gabon (Libreville).' },
  infogérance:{ t: 'Infogérance (MSP)',           d: 'Supervision 24/7, helpdesk, maintenance préventive & corrective, reporting mensuel, SLA sur mesure pour TPE/PME/ETI.' }
};

function localReply(msg) {
  const m = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (/^(bonjour|salut|hello|bonsoir|coucou|hi|hey|bjr|slt)\b/.test(m))
    return "Bonjour ! 👋 Je suis l'assistant Webit-AI.\n\nJe peux vous renseigner sur nos services IT, certifications, zones d'intervention, ou vous aider à préparer une demande de devis.\n\nQu'est-ce qui vous amène ?";

  if (/\b(merci|parfait|super|excellent|au revoir|bye|bonne journee)\b/.test(m))
    return "Avec plaisir ! 😊\nN'hésitez pas à nous contacter :\n📧 contact@webit-ai.com\n📞 +33 6 15 19 76 25\n\nBonne journée !";

  if (/\b(devis|tarif|prix|cout|budget|offre|propositi)\b/.test(m))
    return "Je vais afficher le formulaire de devis directement ici.\n\n📋 Remplissez vos coordonnées et nous vous répondrons sous 24h. C'est gratuit et sans engagement.";

  if (/\b(starlink|satellite|internet satellite|terminal)\b/.test(m)) {
    const s = KB_SERVICES.starlink;
    return `🛰️ **${s.t}**\n\n${s.d}\n\nNous sommes l'un des rares prestataires à intégrer Starlink Business en France ET au Gabon.\n\n📩 contact@webit-ai.com`;
  }
  if (/\b(gabon|libreville|afrique|international)\b/.test(m))
    return "🌍 **Intervention au Gabon**\n\nWebit AI intervient à Libreville et dans les régions du Gabon.\n\nSur place : réseau, sécurité, Starlink Business, vidéosurveillance, administration système à distance.\n\n📩 contact@webit-ai.com | 📞 +33 6 15 19 76 25";

  if (/\b(securite|firewall|fortinet|fortigate|palo alto|edr|sentinelone|wazuh|rgpd|iso27001|audit|cyber)\b/.test(m)) {
    const s = KB_SERVICES.securite;
    return `🛡️ **${s.t}**\n\n${s.d}\n\n🏆 Webit AI est **Fortinet Integrator Partner certifié**.\n\n📩 Audit de sécurité sur demande : contact@webit-ai.com`;
  }
  if (/\b(reseau|lan|wan|vlan|cisco|aruba|switch|routeur|vpn|sd-wan|f5)\b/.test(m)) {
    const s = KB_SERVICES.reseau;
    return `🌐 **${s.t}**\n\n${s.d}\n\n📩 contact@webit-ai.com`;
  }
  if (/\b(wifi|wi-fi|wireless|borne|access point|ekahau|meraki|ruckus|802\.1x|site survey)\b/.test(m)) {
    const s = KB_SERVICES.wifi;
    return `📡 **${s.t}**\n\n${s.d}\n\n📩 contact@webit-ai.com`;
  }
  if (/\b(cloud|azure|aws|gcp|ansible|terraform|devops|ci.cd|kubernetes|docker|migration)\b/.test(m)) {
    const s = KB_SERVICES.cloud;
    return `☁️ **${s.t}**\n\n${s.d}\n\n📩 contact@webit-ai.com`;
  }
  if (/\b(video|camera|videosurveillance|nvr|4k|surveillance|cctv)\b/.test(m)) {
    const s = KB_SERVICES.video;
    return `📹 **${s.t}**\n\n${s.d}\n\n📩 contact@webit-ai.com`;
  }
  if (/\b(systeme|serveur|server|windows server|linux|ubuntu|vmware|hyper-v|proxmox|active directory|monitoring|sauvegarde|backup|virtuali)\b/.test(m)) {
    const s = KB_SERVICES.systeme;
    return `💻 **${s.t}**\n\n${s.d}\n\n📩 contact@webit-ai.com`;
  }
  if (/\b(infogerance|infog|msp|support|maintenance|contrat|sla|astreinte|24.7|tpe|pme)\b/.test(m)) {
    const s = KB_SERVICES['infogérance'];
    return `🔧 **${s.t}**\n\n${s.d}\n\n📄 webit-ai.github.io/infogerance.html\n📩 contact@webit-ai.com`;
  }
  if (/\b(service|prestati|offre|que faites|proposez|competence|domaine|metier)\b/.test(m))
    return "🏢 **Nos 7 domaines d'expertise**\n\n1. 💻 Administration Système\n2. 🌐 Infrastructure Réseau\n3. 🛡️ Sécurité (Fortinet certifié)\n4. 📡 WiFi Professionnel\n5. 📹 Vidéosurveillance IP\n6. ☁️ Cloud & Automatisation\n7. 🛰️ Intégration Starlink\n\n+ Infogérance MSP\n\nSur quel sujet voulez-vous plus d'informations ?";

  if (/\b(contact|email|mail|telephone|tel|adresse|zone|france|idf|localisation)\b/.test(m))
    return "📬 **Nous contacter**\n\n📧 contact@webit-ai.com\n📞 +33 6 15 19 76 25\n\n📍 Zones :\n• France – Île-de-France\n• Gabon – Libreville & région\n\n🕐 9h–18h (standard) | Astreinte 24/7 sur contrat";

  if (/\b(reference|client|mission|adp|aeroport|baa|acorus|experience)\b/.test(m))
    return "🏆 **Références**\n\n• BAA Training – Aviation Academy (Massy, Vilnius, Londres)\n• Groupe ADP – Aéroports de Paris\n• Acorus – Rénovation & Facility (France & International)\n\n📩 contact@webit-ai.com";

  if (/\b(partenaire|partner|certif|bitdefender|ingram|ekahau)\b/.test(m))
    return "🤝 **Partenaires certifiés**\n\n• Fortinet – Integrator Partner ✅\n• Bitdefender – Revendeur\n• Ingram Micro – Distributeur\n• Ekahau – WiFi Design & Survey\n\n📩 contact@webit-ai.com";

  if (/\b(webit|qui etes|presentation|entreprise|societe|propos|ans|expertise)\b/.test(m))
    return "🏢 **Webit AI**\n\nSSII française spécialisée en infrastructure IT.\n\n✅ 4+ ans d'expertise\n✅ 100+ serveurs gérés\n✅ 50+ projets réalisés\n✅ Support 24/7 disponible\n\nFrance (Île-de-France) & Gabon (Libreville)\n\n📩 contact@webit-ai.com\n📞 +33 6 15 19 76 25";

  return "Je n'ai pas d'information précise sur ce point, mais nos experts peuvent vous répondre rapidement.\n\n📩 contact@webit-ai.com\n📞 +33 6 15 19 76 25\n\nOu précisez votre besoin et j'essaie de vous orienter.";
}

// ─── Classe principale ─────────────────────────────────────────────────────────

class WebitChatbot {
  constructor() {
    this.isOpen    = false;
    this.zone      = null;
    this.leadShown = false;
    this.messages  = [{
      role: 'assistant',
      content: "Bonjour ! 👋 Je suis l'assistant Webit-AI.\n\nComment puis-je vous aider concernant nos services informatiques ?"
    }];
    this.init();
  }

  async init() {
    this.injectStyles();
    this.createWidget();
    this.attachListeners();
    this.zone = await this.detectZone();
  }

  async detectZone() {
    try {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3000);
      const r     = await fetch('https://ipapi.co/json/', { signal: ctrl.signal });
      clearTimeout(timer);
      const d = await r.json();
      if (d.country_code === 'GA') return 'Gabon';
      if (d.country_code === 'FR') return 'France';
      return d.country_name || null;
    } catch { return null; }
  }

  // ─── Styles ───────────────────────────────────────────────────────────────

  injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      @keyframes wb-pulse {
        0%,100%{ transform:scale(1); box-shadow:0 0 0 0 rgba(0,158,96,.7); }
        50%    { transform:scale(1.05); box-shadow:0 0 0 10px rgba(0,158,96,0); }
      }
      @keyframes wb-float {
        0%,100%{ transform:translateY(0); }
        50%    { transform:translateY(-10px); }
      }
      @keyframes wb-bounce {
        0%,80%,100%{ transform:scale(0); }
        40%        { transform:scale(1); }
      }
      @keyframes wb-fadein {
        from{ opacity:0; transform:translateY(8px); }
        to  { opacity:1; transform:translateY(0); }
      }

      /* ── Bouton flottant ── */
      .wb-btn {
        position:fixed; bottom:24px; right:24px;
        width:70px; height:70px; border-radius:50%;
        background:linear-gradient(135deg,${CHATBOT_CONFIG.colors.secondary},${CHATBOT_CONFIG.colors.accent},${CHATBOT_CONFIG.colors.primary});
        border:none; cursor:pointer;
        box-shadow:0 8px 24px rgba(0,0,0,.3);
        z-index:9999; display:flex; align-items:center; justify-content:center;
        transition:all .3s ease;
        animation:wb-pulse 2s infinite, wb-float 3s ease-in-out infinite;
      }
      .wb-btn:hover {
        transform:scale(1.1) translateY(-5px);
        box-shadow:0 12px 32px rgba(0,0,0,.4);
        animation:none;
      }
      .wb-btn svg { width:36px; height:36px; fill:white; }
      .wb-badge {
        position:absolute; top:-5px; right:-5px;
        background:#FF4444; color:white; border-radius:50%;
        width:24px; height:24px; display:flex;
        align-items:center; justify-content:center;
        font-size:11px; font-weight:700; border:3px solid white;
        animation:wb-pulse 2s infinite;
      }

      /* ── Fenêtre ── */
      .wb-win {
        position:fixed; bottom:24px; right:24px;
        width:380px; height:610px;
        background:white; border-radius:16px;
        box-shadow:0 8px 40px rgba(0,0,0,.22);
        z-index:9999; display:none; flex-direction:column; overflow:hidden;
      }
      .wb-win.open { display:flex; animation:wb-fadein .25s ease; }

      /* ── Header ── */
      .wb-header {
        background:linear-gradient(90deg,${CHATBOT_CONFIG.colors.secondary},${CHATBOT_CONFIG.colors.accent},${CHATBOT_CONFIG.colors.primary});
        color:white; padding:15px 16px;
        display:flex; justify-content:space-between; align-items:center;
        flex-shrink:0;
      }
      .wb-header-info { display:flex; align-items:center; gap:11px; }
      .wb-avatar {
        width:40px; height:40px; background:white; border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        font-size:22px; flex-shrink:0;
      }
      .wb-title h3 { margin:0; font-size:15px; font-weight:700; }
      .wb-title p  { margin:0; font-size:11.5px; opacity:.88; }
      .wb-zone-tag {
        display:inline-block;
        background:rgba(255,255,255,.22);
        border-radius:99px;
        padding:1px 8px;
        font-size:10.5px;
        margin-top:2px;
      }
      .wb-close {
        background:rgba(255,255,255,.2); border:none; color:white;
        width:32px; height:32px; border-radius:50%; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        font-size:18px; transition:background .25s; flex-shrink:0;
      }
      .wb-close:hover { background:rgba(255,255,255,.35); }

      /* ── Messages ── */
      .wb-msgs {
        flex:1; overflow-y:auto; padding:14px;
        background:#f4f6f9; scroll-behavior:smooth;
      }
      .wb-msg { margin-bottom:13px; display:flex; }
      .wb-msg.user      { justify-content:flex-end; }
      .wb-msg.assistant { justify-content:flex-start; }
      .wb-bubble {
        max-width:83%; padding:11px 14px; border-radius:16px;
        font-size:13.5px; line-height:1.55; white-space:pre-wrap; word-break:break-word;
        animation:wb-fadein .2s ease;
      }
      .wb-msg.user      .wb-bubble {
        background:${CHATBOT_CONFIG.colors.primary}; color:white;
        border-bottom-right-radius:4px;
      }
      .wb-msg.assistant .wb-bubble {
        background:white; color:#2d2d2d;
        box-shadow:0 2px 8px rgba(0,0,0,.09);
        border-bottom-left-radius:4px;
      }
      .wb-bubble a { color:${CHATBOT_CONFIG.colors.primary}; text-decoration:underline; }
      .wb-msg.user .wb-bubble a { color:#fff; }
      .wb-bubble strong { font-weight:700; }

      /* ── Loading dots ── */
      .wb-loading {
        display:flex; gap:5px; padding:12px 14px;
        background:white; border-radius:16px; border-bottom-left-radius:4px;
        box-shadow:0 2px 8px rgba(0,0,0,.08); width:fit-content;
      }
      .wb-dot {
        width:8px; height:8px; background:${CHATBOT_CONFIG.colors.primary};
        border-radius:50%; animation:wb-bounce 1.2s infinite ease-in-out both;
      }
      .wb-dot:nth-child(1){ animation-delay:-.32s; }
      .wb-dot:nth-child(2){ animation-delay:-.16s; }

      /* ── Suggestions ── */
      .wb-suggestions {
        display:flex; flex-wrap:wrap; gap:6px;
        padding:8px 14px 10px; background:#f4f6f9;
        border-top:1px solid #e8e8e8; flex-shrink:0;
      }
      .wb-chip {
        background:white; border:1.5px solid #ddd; border-radius:16px;
        padding:5px 11px; font-size:12px; cursor:pointer;
        color:${CHATBOT_CONFIG.colors.primary}; transition:all .2s;
        white-space:nowrap; font-family:inherit;
      }
      .wb-chip:hover {
        background:${CHATBOT_CONFIG.colors.primary};
        color:white; border-color:${CHATBOT_CONFIG.colors.primary};
      }

      /* ── Input ── */
      .wb-input-wrap {
        padding:13px 14px; background:white;
        border-top:1px solid #e8e8e8; flex-shrink:0;
      }
      .wb-form { display:flex; gap:8px; }
      .wb-input {
        flex:1; padding:11px 14px; border:1.5px solid #ddd;
        border-radius:24px; font-size:14px; outline:none;
        transition:border-color .2s; font-family:inherit;
      }
      .wb-input:focus { border-color:${CHATBOT_CONFIG.colors.primary}; }
      .wb-send {
        background:${CHATBOT_CONFIG.colors.primary}; color:white;
        border:none; width:44px; height:44px; border-radius:50%;
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        transition:background .25s, transform .15s; flex-shrink:0;
      }
      .wb-send:hover:not(:disabled) {
        background:${CHATBOT_CONFIG.colors.secondary}; transform:scale(1.05);
      }
      .wb-send:disabled { opacity:.5; cursor:not-allowed; }

      /* ── Footer ── */
      .wb-footer {
        padding:6px 14px; text-align:center; font-size:11px;
        color:#aaa; background:#fafafa; border-top:1px solid #efefef; flex-shrink:0;
      }
      .wb-footer a { color:${CHATBOT_CONFIG.colors.primary}; text-decoration:none; }

      /* ── Formulaire de devis ── */
      .wb-lead-card {
        background:white; border-radius:14px; border-bottom-left-radius:4px;
        box-shadow:0 4px 18px rgba(0,0,0,.13); overflow:hidden;
        width:300px; max-width:88%; animation:wb-fadein .25s ease;
      }
      .wb-lead-head {
        background:linear-gradient(90deg,${CHATBOT_CONFIG.colors.secondary},${CHATBOT_CONFIG.colors.accent},${CHATBOT_CONFIG.colors.primary});
        padding:12px 15px; display:flex; align-items:center; gap:10px;
      }
      .wb-lead-head-icon { font-size:20px; }
      .wb-lead-head-label { color:white; }
      .wb-lead-head-title { font-size:14px; font-weight:700; }
      .wb-lead-head-sub   { font-size:11px; opacity:.85; }
      .wb-lead-body { padding:14px; display:flex; flex-direction:column; gap:8px; }
      .wb-lead-field {
        width:100%; padding:9px 12px; border:1.5px solid #e0e0e0;
        border-radius:8px; font-size:13px; outline:none;
        font-family:inherit; box-sizing:border-box; transition:border-color .2s;
        background:white;
      }
      .wb-lead-field:focus { border-color:${CHATBOT_CONFIG.colors.primary}; }
      .wb-lead-field.error { border-color:#ff4444 !important; }
      textarea.wb-lead-field { resize:none; }
      .wb-lead-submit {
        background:${CHATBOT_CONFIG.colors.primary}; color:white;
        border:none; padding:11px; border-radius:8px; cursor:pointer;
        font-size:13px; font-weight:700; transition:background .2s;
        font-family:inherit; width:100%;
      }
      .wb-lead-submit:hover:not(:disabled) { background:${CHATBOT_CONFIG.colors.secondary}; }
      .wb-lead-submit:disabled { opacity:.6; cursor:not-allowed; }
      .wb-lead-privacy { font-size:10.5px; color:#aaa; text-align:center; }

      /* ── Confirmation ── */
      .wb-success-card {
        background:white; border-radius:14px; border-bottom-left-radius:4px;
        box-shadow:0 4px 18px rgba(0,0,0,.1);
        padding:22px 18px; text-align:center;
        width:280px; max-width:88%; animation:wb-fadein .3s ease;
      }
      .wb-success-icon  { font-size:40px; margin-bottom:10px; }
      .wb-success-title { font-size:16px; font-weight:700; color:#1a1a1a; margin-bottom:6px; }
      .wb-success-text  { font-size:13px; color:#555; line-height:1.5; }
      .wb-success-text strong { color:${CHATBOT_CONFIG.colors.primary}; }

      /* ── Responsive ── */
      @media(max-width:420px){
        .wb-win {
          width:calc(100vw - 16px); right:8px; bottom:8px;
          height:92vh; max-height:620px; border-radius:14px;
        }
        .wb-btn { bottom:14px; right:14px; }
      }
    `;
    document.head.appendChild(s);
  }

  // ─── Widget HTML ───────────────────────────────────────────────────────────

  createWidget() {
    // Bouton
    const btn = document.createElement('button');
    btn.className = 'wb-btn';
    btn.setAttribute('aria-label', 'Ouvrir le chat');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.67-.33-3.82-.91l-.27-.16-2.91.49.49-2.91-.16-.27C4.33 14.67 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4-9h-3V8c0-.55-.45-1-1-1s-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
      <div class="wb-badge">IA</div>
    `;
    btn.onclick = () => this.toggle();

    // Fenêtre
    const win = document.createElement('div');
    win.className = 'wb-win';
    win.innerHTML = `
      <div class="wb-header">
        <div class="wb-header-info">
          <div class="wb-avatar">🤖</div>
          <div class="wb-title">
            <h3>Assistant Webit-AI</h3>
            <p id="wb-zone-line">Répond instantanément</p>
          </div>
        </div>
        <button class="wb-close" aria-label="Fermer">✕</button>
      </div>
      <div class="wb-msgs" id="wb-msgs"></div>
      <div class="wb-suggestions" id="wb-sugg">
        <button class="wb-chip">Services réseau</button>
        <button class="wb-chip">Sécurité Fortinet</button>
        <button class="wb-chip">Intégration Starlink</button>
        <button class="wb-chip">Intervention Gabon</button>
        <button class="wb-chip">Demander un devis</button>
      </div>
      <div class="wb-input-wrap">
        <form class="wb-form" id="wb-form">
          <input type="text" class="wb-input" id="wb-input"
            placeholder="Posez votre question..." autocomplete="off" maxlength="500"/>
          <button type="submit" class="wb-send" id="wb-send" aria-label="Envoyer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
      <div class="wb-footer">
        Contact direct → <a href="mailto:contact@webit-ai.com">contact@webit-ai.com</a>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(win);

    this.el = {
      btn, win,
      msgs:  win.querySelector('#wb-msgs'),
      sugg:  win.querySelector('#wb-sugg'),
      form:  win.querySelector('#wb-form'),
      input: win.querySelector('#wb-input'),
      send:  win.querySelector('#wb-send'),
      zoneLine: win.querySelector('#wb-zone-line')
    };

    this.renderMsgs();

    this.el.sugg.querySelectorAll('.wb-chip').forEach(c => {
      c.onclick = () => {
        this.el.input.value = c.textContent;
        this.el.sugg.style.display = 'none';
        this.el.form.dispatchEvent(new Event('submit', { cancelable: true }));
      };
    });
  }

  attachListeners() {
    this.el.win.querySelector('.wb-close').onclick = () => this.toggle();
    this.el.form.onsubmit = e => this.onSend(e);

    this.el.input.addEventListener('input', () => {
      if (this.el.input.value) this.el.sugg.style.display = 'none';
    });

    // Clic extérieur → ferme
    document.addEventListener('click', e => {
      if (this.isOpen && !this.el.win.contains(e.target) && !this.el.btn.contains(e.target))
        this.toggle();
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.el.win.classList.toggle('open', this.isOpen);
    this.el.btn.style.display = this.isOpen ? 'none' : 'flex';

    if (this.isOpen) {
      setTimeout(() => this.el.input.focus(), 100);
      this.scrollDown();

      // Afficher la zone détectée dans le header
      if (this.zone) {
        this.el.zoneLine.innerHTML = `Répond instantanément · <span class="wb-zone-tag">${this.zone === 'France' ? '🇫🇷' : this.zone === 'Gabon' ? '🇬🇦' : '🌍'} ${this.zone}</span>`;
      }
    }
  }

  // ─── Rendu messages ──────────────────────────────────────────────────────

  fmt(text) {
    return text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
  }

  renderMsgs() {
    this.el.msgs.innerHTML = this.messages.map(m => `
      <div class="wb-msg ${m.role}">
        <div class="wb-bubble">${this.fmt(m.content)}</div>
      </div>
    `).join('');
    this.scrollDown();
  }

  scrollDown() {
    this.el.msgs.scrollTop = this.el.msgs.scrollHeight;
  }

  showLoading() {
    const d = document.createElement('div');
    d.className = 'wb-msg assistant'; d.id = 'wb-loading';
    d.innerHTML = `<div class="wb-loading"><div class="wb-dot"></div><div class="wb-dot"></div><div class="wb-dot"></div></div>`;
    this.el.msgs.appendChild(d);
    this.scrollDown();
  }

  hideLoading() {
    document.getElementById('wb-loading')?.remove();
  }

  // ─── Envoi message ────────────────────────────────────────────────────────

  async onSend(e) {
    e.preventDefault();
    const msg = this.el.input.value.trim();
    if (!msg) return;

    const isLeadRequest = LEAD_REGEX.test(msg);

    this.el.sugg.style.display = 'none';
    this.messages.push({ role: 'user', content: msg });
    this.renderMsgs();
    this.el.input.value = '';
    this.el.send.disabled = true;
    this.showLoading();

    let reply;
    if (AI_ON) {
      reply = await this.callAI(msg);
    } else {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 450));
      reply = localReply(msg);
    }

    this.hideLoading();
    this.messages.push({ role: 'assistant', content: reply });
    this.renderMsgs();

    if (isLeadRequest && !this.leadShown) {
      setTimeout(() => this.showLeadForm(), 600);
    }

    this.el.send.disabled = false;
    this.el.input.focus();
  }

  async callAI(msg) {
    try {
      const zoneCtx = this.zone ? `[ZONE: ${this.zone}] ` : '';
      const history = this.messages.slice(-8).map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${CHATBOT_CONFIG.workerUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: zoneCtx + msg, history }),
        signal: AbortSignal.timeout(12000)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      if (d.success && d.response) return d.response;
      throw new Error('no response');
    } catch (err) {
      console.warn('AI fallback:', err.message);
      return localReply(msg);
    }
  }

  // ─── Formulaire de devis ──────────────────────────────────────────────────

  showLeadForm() {
    if (this.leadShown) return;
    this.leadShown = true;

    const zoneOpts = [
      `<option value="">📍 Votre localisation *</option>`,
      `<option value="France"${this.zone==='France'?' selected':''}>🇫🇷 France</option>`,
      `<option value="Gabon"${this.zone==='Gabon'?' selected':''}>🇬🇦 Gabon</option>`,
      `<option value="Autre">🌍 Autre pays</option>`
    ].join('');

    const svcOpts = `<option value="">Service concerné (optionnel)</option>` +
      SERVICES.map(s => `<option value="${s}">${s}</option>`).join('');

    const wrap = document.createElement('div');
    wrap.className = 'wb-msg assistant';
    wrap.id = 'wb-lead-wrap';
    wrap.innerHTML = `
      <div class="wb-lead-card">
        <div class="wb-lead-head">
          <div class="wb-lead-head-icon">📋</div>
          <div class="wb-lead-head-label">
            <div class="wb-lead-head-title">Demande de devis</div>
            <div class="wb-lead-head-sub">Gratuit · Sans engagement · Réponse sous 24h</div>
          </div>
        </div>
        <div class="wb-lead-body">
          <form id="wb-lead-form" novalidate>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <input  type="text"  name="name"    class="wb-lead-field" placeholder="Prénom & Nom *"           required autocomplete="name"/>
              <input  type="email" name="email"   class="wb-lead-field" placeholder="Email professionnel *"    required autocomplete="email"/>
              <input  type="tel"   name="phone"   class="wb-lead-field" placeholder="Téléphone"                         autocomplete="tel"/>
              <select name="zone"  class="wb-lead-field" required>${zoneOpts}</select>
              <select name="service" class="wb-lead-field">${svcOpts}</select>
              <textarea name="project" class="wb-lead-field" rows="3" placeholder="Décrivez brièvement votre projet..."></textarea>
              <button type="submit" class="wb-lead-submit" id="wb-lead-btn">Envoyer ma demande →</button>
              <div class="wb-lead-privacy">🔒 Vos données restent confidentielles et ne sont pas partagées.</div>
            </div>
          </form>
        </div>
      </div>
    `;

    this.el.msgs.appendChild(wrap);
    this.scrollDown();

    document.getElementById('wb-lead-form').addEventListener('submit', e => this.submitLead(e));
  }

  async submitLead(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = document.getElementById('wb-lead-btn');

    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const zone  = form.zone.value;

    // Validation
    let ok = true;
    [form.name, form.email, form.zone].forEach(f => {
      if (!f.value.trim()) { f.classList.add('error'); ok = false; }
      else                  { f.classList.remove('error'); }
    });
    if (!ok) return;

    btn.disabled    = true;
    btn.textContent = 'Envoi en cours...';

    const payload = {
      access_key:    CHATBOT_CONFIG.web3formsKey,
      subject:       `🔔 Nouveau devis Webit AI – ${zone} – ${name}`,
      from_name:     'Chatbot Webit AI',
      replyto:       email,
      name,
      email,
      telephone:     form.phone.value.trim() || 'Non renseigné',
      localisation:  zone,
      service:       form.service.value || 'Non précisé',
      projet:        form.project.value.trim() || 'Non précisé',
      zone_detectee: this.zone ? `${this.zone} (géolocalisation IP)` : 'Non détectée',
      botcheck:      false
    };

    try {
      let success = false;

      if (FORMS_ON) {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        });
        const data = await res.json();
        success    = data.success;
      } else {
        // Fallback : ouvrir le client mail avec les infos pré-remplies
        const body = encodeURIComponent(
          `Nom: ${name}\nEmail: ${email}\nTéléphone: ${payload.telephone}\nLocalisation: ${zone}\nService: ${payload.service}\nProjet: ${payload.projet}`
        );
        window.open(`mailto:contact@webit-ai.com?subject=${encodeURIComponent(payload.subject)}&body=${body}`, '_blank');
        success = true;
      }

      if (success) {
        // Remplacer le formulaire par la confirmation
        document.getElementById('wb-lead-wrap').innerHTML = `
          <div class="wb-success-card">
            <div class="wb-success-icon">✅</div>
            <div class="wb-success-title">Demande envoy��e !</div>
            <div class="wb-success-text">
              Merci <strong>${name.split(' ')[0]}</strong>, nous vous répondrons sous 24h<br>
              à <strong>${email}</strong>.
            </div>
          </div>
        `;
        this.scrollDown();

        // Message de suivi du bot
        setTimeout(() => {
          this.messages.push({
            role: 'assistant',
            content: `Votre demande est bien envoyée ! 🎉\n\nNous vous contacterons à ${email} sous 24h ouvrées.\n\nEn attendant :\n📞 +33 6 15 19 76 25\n📧 contact@webit-ai.com`
          });
          this.renderMsgs();
        }, 900);
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      btn.disabled    = false;
      btn.textContent = 'Réessayer';
      this.messages.push({
        role: 'assistant',
        content: 'Une erreur est survenue lors de l\'envoi.\n\nContactez-nous directement :\n📧 contact@webit-ai.com\n📞 +33 6 15 19 76 25'
      });
      this.renderMsgs();
    }
  }
}

// ─── Démarrage ────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WebitChatbot());
} else {
  new WebitChatbot();
}
