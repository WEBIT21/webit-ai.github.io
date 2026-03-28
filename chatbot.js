// Configuration
const CHATBOT_CONFIG = {
  colors: {
    primary: '#3A75C4',
    secondary: '#009E60',
    accent: '#FCD116'
  }
};

// Base de connaissances Webit AI
const KB = {
  services: {
    systeme: {
      titre: "Administration Système",
      desc: "Gestion complète de vos serveurs Windows et Linux, virtualisation, monitoring et maintenance proactive.",
      details: [
        "Windows Server & Active Directory",
        "Linux : RedHat, Ubuntu, CentOS",
        "Virtualisation : VMware, Hyper-V, Proxmox",
        "Monitoring & Alerting (Zabbix, Grafana)",
        "Sauvegardes & PRA"
      ]
    },
    reseau: {
      titre: "Infrastructure Réseau",
      desc: "Conception et déploiement d'architectures réseau performantes, sécurisées et évolutives.",
      details: [
        "Architecture LAN/WAN & VLAN",
        "Équipements Cisco, Aruba, HP",
        "VPN & Interconnexion multi-sites",
        "F5 Load Balancing",
        "SD-WAN"
      ]
    },
    securite: {
      titre: "Sécurité Informatique",
      desc: "Protection complète avec firewall nouvelle génération, EDR, audits de sécurité et mise en conformité RGPD/ISO27001.",
      details: [
        "Firewall Fortinet FortiGate & Palo Alto",
        "EDR : SentinelOne, Wazuh",
        "Audits de sécurité & tests d'intrusion",
        "Mise en conformité RGPD & ISO27001",
        "SOC & détection d'incidents"
      ]
    },
    wifi: {
      titre: "WiFi Professionnel",
      desc: "Déploiement de réseaux WiFi haute performance avec site survey Ekahau et gestion centralisée.",
      details: [
        "Site Survey & Design RF (Ekahau)",
        "Solutions Aruba, Cisco Meraki, Ruckus",
        "Authentification 802.1X & portail captif",
        "Gestion cloud Aruba Central",
        "Couverture multi-bâtiments"
      ]
    },
    video: {
      titre: "Vidéosurveillance IP",
      desc: "Systèmes de vidéosurveillance professionnels avec caméras 4K/8MP et analyse vidéo intelligente par IA.",
      details: [
        "Caméras IP 4K/8MP PTZ et fixes",
        "NVR & stockage haute capacité",
        "Analyse vidéo par intelligence artificielle",
        "Accès distant sécurisé (mobile & web)",
        "Intégration avec contrôle d'accès"
      ]
    },
    cloud: {
      titre: "Cloud & Automatisation",
      desc: "Migration cloud et automatisation avec Ansible/Terraform pour optimiser vos infrastructures.",
      details: [
        "Microsoft Azure, AWS, Google Cloud",
        "Ansible/AWX, Terraform",
        "Infrastructure as Code (IaC)",
        "Pipelines DevOps & CI/CD",
        "Migration & audit cloud"
      ]
    },
    starlink: {
      titre: "Intégration Starlink Business",
      desc: "Déploiement terrain Starlink Business en France et en Afrique Centrale (Gabon). Mise en service rapide et professionnelle.",
      details: [
        "Étude de site & faisabilité",
        "Montage & orientation du terminal",
        "Câblage & protection électrique",
        "Intégration dans infrastructure existante",
        "Zones couvertes : France & Gabon"
      ]
    }
  },
  contact: {
    email: "contact@webit-ai.com",
    tel: "+33 6 15 19 76 25",
    zones: "Île-de-France (France) et Libreville (Gabon)",
    horaires: "9h–18h en standard, astreinte 24/7 disponible"
  },
  partenaires: ["Fortinet (Integrator Partner certifié)", "Bitdefender", "Ingram Micro", "Ekahau"],
  references: ["BAA Training (Massy-Palaiseau, Vilnius, Londres)", "Groupe ADP – Aéroports de Paris", "Acorus – Rénovation & Facility"]
};

// Moteur de réponses locales
function getLocalResponse(message) {
  const msg = message.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // retire accents pour matching

  // Salutations
  if (/^(bonjour|salut|hello|bonsoir|coucou|hi|hey|bjr|slt)\b/.test(msg)) {
    return "Bonjour ! 👋 Je suis l'assistant Webit-AI.\n\nJe peux vous renseigner sur nos services IT, nos certifications, nos zones d'intervention ou vous aider à préparer une demande de devis.\n\nQu'est-ce qui vous amène aujourd'hui ?";
  }

  // Remerciements / au revoir
  if (/\b(merci|thank|parfait|super|excellent|tres bien|tres utile|bonne journee|au revoir|bye|bonsoir)\b/.test(msg)) {
    return "Avec plaisir ! 😊\n\nN'hésitez pas à nous contacter directement :\n📧 contact@webit-ai.com\n📞 +33 6 15 19 76 25\n\nBonne journée !";
  }

  // Devis / tarifs / prix
  if (/\b(devis|tarif|prix|cout|combien|budget|gratuit|offre|proposition|facture)\b/.test(msg)) {
    return "Pour obtenir un devis personnalisé, voici comment procéder :\n\n📋 **Devis gratuit & sans engagement**\nNos tarifs dépendent de la nature et de l'envergure de votre projet.\n\n📩 Envoyez votre demande à :\ncontact@webit-ai.com\n\n📞 Ou appelez directement :\n+33 6 15 19 76 25\n\n🌐 Formulaire en ligne :\nwebit-ai.com/contact.html\n\nNous vous répondons généralement sous 24h ouvrées.";
  }

  // Starlink
  if (/\b(starlink|satellite|connexion satellite|internet satellite|terminal)\b/.test(msg)) {
    const s = KB.services.starlink;
    return `🛰️ **${s.titre}**\n\n${s.desc}\n\nCe que nous réalisons :\n${s.details.map(d => `• ${d}`).join('\n')}\n\nNous sommes l'un des rares prestataires IT à proposer l'intégration Starlink Business aussi bien en France (Île-de-France) qu'au Gabon (Libreville et région).\n\n📩 Demande de devis : contact@webit-ai.com`;
  }

  // Gabon / Afrique
  if (/\b(gabon|libreville|afrique|international|africa)\b/.test(msg)) {
    return "🌍 **Intervention au Gabon**\n\nWebit AI intervient au Gabon, notamment à Libreville et dans les régions environnantes.\n\nNos missions sur place incluent :\n• Infrastructure réseau & sécurité\n• Déploiement Starlink Business\n• Vidéosurveillance IP\n• Administration système à distance\n\nNous opérons également en France (Île-de-France) et en Europe.\n\n📩 Pour toute mission internationale : contact@webit-ai.com\n📞 +33 6 15 19 76 25";
  }

  // Sécurité / Fortinet / firewall
  if (/\b(securite|securit|firewall|fortinet|fortigate|palo alto|edr|sentinelone|wazuh|rgpd|iso27001|audit|intrusion|cybersecu|hacker|ransomware|malware|virus)\b/.test(msg)) {
    const s = KB.services.securite;
    return `🛡️ **${s.titre}**\n\n${s.desc}\n\nNos solutions :\n${s.details.map(d => `• ${d}`).join('\n')}\n\n🏆 Webit AI est **Fortinet Integrator Partner certifié**, ce qui garantit une expertise validée sur les solutions FortiGate.\n\n📩 Audit de sécurité offert sur demande : contact@webit-ai.com`;
  }

  // Réseau / LAN / WAN / Cisco / Aruba
  if (/\b(reseau|lan|wan|vlan|cisco|aruba|switch|routeur|vpn|sd-wan|load.balanc|f5|interconnexion)\b/.test(msg)) {
    const s = KB.services.reseau;
    return `🌐 **${s.titre}**\n\n${s.desc}\n\nNos compétences réseau :\n${s.details.map(d => `• ${d}`).join('\n')}\n\n📩 Pour une étude réseau : contact@webit-ai.com`;
  }

  // WiFi
  if (/\b(wifi|wi-fi|wireless|borne|access point|ekahau|meraki|ruckus|captif|802\.1x|rf|site survey)\b/.test(msg)) {
    const s = KB.services.wifi;
    return `📡 **${s.titre}**\n\n${s.desc}\n\nNos solutions WiFi :\n${s.details.map(d => `• ${d}`).join('\n')}\n\n📩 Besoin d'un audit WiFi ? contact@webit-ai.com`;
  }

  // Cloud / Azure / AWS / Ansible / Terraform / DevOps
  if (/\b(cloud|azure|aws|gcp|google cloud|amazon|devops|ansible|terraform|iac|kubernetes|docker|ci.cd|migration|automatisation)\b/.test(msg)) {
    const s = KB.services.cloud;
    return `☁️ **${s.titre}**\n\n${s.desc}\n\nNos prestations cloud :\n${s.details.map(d => `• ${d}`).join('\n')}\n\n📩 Pour un audit cloud gratuit : contact@webit-ai.com`;
  }

  // Vidéosurveillance / caméra
  if (/\b(video|camera|camara|videosurveillance|nvr|dvr|4k|surveillance|cctv|ia video)\b/.test(msg)) {
    const s = KB.services.video;
    return `📹 **${s.titre}**\n\n${s.desc}\n\nNos solutions :\n${s.details.map(d => `• ${d}`).join('\n')}\n\n📩 Devis vidéosurveillance : contact@webit-ai.com`;
  }

  // Système / serveurs / Linux / Windows / virtualisation
  if (/\b(systeme|serveur|server|windows server|linux|ubuntu|redhat|centos|vmware|hyper-v|proxmox|active directory|ad|monitoring|backup|sauvegarde|virtuali)\b/.test(msg)) {
    const s = KB.services.systeme;
    return `💻 **${s.titre}**\n\n${s.desc}\n\nNos prestations :\n${s.details.map(d => `• ${d}`).join('\n')}\n\n📩 Pour une analyse de votre infrastructure : contact@webit-ai.com`;
  }

  // Infogérance / MSP / support
  if (/\b(infogerance|infog|msp|tpe|pme|externalisation|support|maintenance|contrat|sla|astreinte|24.7)\b/.test(msg)) {
    return "🔧 **Infogérance IT (MSP)**\n\nWebit AI propose des contrats d'infogérance sur mesure pour TPE, PME et grandes entreprises.\n\nInclus dans nos contrats :\n• Supervision 24/7 de votre infrastructure\n• Maintenance préventive & corrective\n• Support utilisateurs (helpdesk)\n• Gestion des mises à jour & sécurité\n• Reporting mensuel détaillé\n• SLA personnalisé selon vos besoins\n\n📄 En savoir plus : webit-ai.github.io/infogerance.html\n📩 contact@webit-ai.com";
  }

  // Références / missions / clients
  if (/\b(reference|client|mission|projet|realise|experience|adp|aeroport|baa|acorus|who|qui)\b/.test(msg)) {
    return `🏆 **Nos références**\n\nWebit AI a réalisé des missions pour :\n\n${KB.references.map(r => `• ${r}`).join('\n')}\n\nCes interventions couvrent les domaines réseau, sécurité, infrastructure système et Starlink.\n\n📩 Vous souhaitez nous rejoindre comme client ? contact@webit-ai.com`;
  }

  // Partenaires / certifications
  if (/\b(partenaire|partner|certif|fortinet|bitdefender|ingram|ekahau)\b/.test(msg)) {
    return `🤝 **Nos partenaires technologiques**\n\n${KB.partenaires.map(p => `• ${p}`).join('\n')}\n\n✅ **Fortinet Integrator Partner** : certification officielle qui atteste notre maîtrise des solutions FortiGate en environnement professionnel.\n\nCes partenariats nous permettent de proposer des solutions certifiées au meilleur prix.\n\n📩 contact@webit-ai.com`;
  }

  // Contact / adresse / email / téléphone / localisation
  if (/\b(contact|email|mail|telephone|tel|appel|adresse|localisation|situe|ou etes|zone|france|idf)\b/.test(msg)) {
    return `📬 **Nous contacter**\n\n📧 Email : contact@webit-ai.com\n📞 Tél : +33 6 15 19 76 25\n🌐 Site : webit-ai.github.io\n\n📍 Zones d'intervention :\n• France – Île-de-France (et déplacements)\n• Gabon – Libreville et région\n• Europe (missions ponctuelles)\n\n🕐 Disponibilité :\n• Standard : 9h–18h (jours ouvrés)\n• Astreinte 24/7 sur contrat d'infogérance\n\n📝 Formulaire de contact : webit-ai.github.io/contact.html`;
  }

  // Services (général)
  if (/\b(service|prestati|offre|que faites|proposez|specialite|metier|competence|domaine)\b/.test(msg)) {
    return "🏢 **Nos 7 domaines d'expertise**\n\nWebit AI est un expert en infrastructure IT couvrant :\n\n1. 💻 Administration Système (Windows, Linux, VMware)\n2. 🌐 Infrastructure Réseau (Cisco, Aruba, SD-WAN)\n3. 🛡️ Sécurité Informatique (Fortinet, EDR, audits)\n4. 📡 WiFi Professionnel (Ekahau, Meraki, Ruckus)\n5. 📹 Vidéosurveillance IP (4K, IA vidéo)\n6. ☁️ Cloud & Automatisation (Azure, Ansible, Terraform)\n7. 🛰️ Intégration Starlink Business\n\nSur quel domaine souhaitez-vous plus d'informations ?";
  }

  // Webit / présentation / qui êtes vous
  if (/\b(webit|qui etes|presentation|entreprise|societe|equipe|fondateur|histoire|ans|experience|propos)\b/.test(msg)) {
    return "🏢 **Webit AI – Qui sommes-nous ?**\n\nWebit AI est une société de services informatiques spécialisée dans l'infrastructure IT.\n\n✅ 4+ années d'expertise terrain\n✅ 100+ serveurs gérés\n✅ 50+ projets réalisés\n✅ Support 24/7 disponible\n\nNous accompagnons TPE, PME et grands groupes dans leurs projets IT en France (Île-de-France) et au Gabon (Libreville).\n\nNos références incluent BAA Training, Groupe ADP et Acorus.\n\n📩 contact@webit-ai.com\n📞 +33 6 15 19 76 25";
  }

  // Réponse par défaut
  return "Je n'ai pas d'information précise sur ce sujet, mais nos experts peuvent vous répondre rapidement.\n\n📩 **contact@webit-ai.com**\n📞 **+33 6 15 19 76 25**\n\nOu décrivez-moi davantage votre besoin et j'essaierai de vous orienter parmi nos services :\n• Administration système\n• Infrastructure réseau\n• Sécurité informatique\n• WiFi professionnel\n• Vidéosurveillance IP\n• Cloud & automatisation\n• Intégration Starlink";
}

class WebitChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [
      {
        role: 'assistant',
        content: "Bonjour ! 👋\n\nJe suis l'assistant virtuel Webit-AI.\n\nComment puis-je vous aider concernant nos services informatiques ?"
      }
    ];
    this.init();
  }

  init() {
    this.injectStyles();
    this.createChatWidget();
    this.attachEventListeners();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes webit-pulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(0, 158, 96, 0.7);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 0 10px rgba(0, 158, 96, 0);
        }
      }

      @keyframes webit-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      .webit-chatbot-button {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${CHATBOT_CONFIG.colors.secondary} 0%, ${CHATBOT_CONFIG.colors.accent} 50%, ${CHATBOT_CONFIG.colors.primary} 100%);
        border: none;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        animation: webit-pulse 2s infinite, webit-float 3s ease-in-out infinite;
      }

      .webit-chatbot-button:hover {
        transform: scale(1.1) translateY(-5px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        animation: none;
      }

      .webit-chatbot-button svg {
        width: 36px;
        height: 36px;
        fill: white;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      }

      .webit-chatbot-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #FF4444;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        border: 3px solid white;
        animation: webit-pulse 2s infinite;
      }

      .webit-chatbot-window {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 380px;
        height: 600px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 9999;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }

      .webit-chatbot-window.open {
        display: flex;
      }

      .webit-chatbot-header {
        background: linear-gradient(90deg, ${CHATBOT_CONFIG.colors.secondary} 0%, ${CHATBOT_CONFIG.colors.accent} 50%, ${CHATBOT_CONFIG.colors.primary} 100%);
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .webit-chatbot-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .webit-chatbot-avatar {
        width: 40px;
        height: 40px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
      }

      .webit-chatbot-title h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .webit-chatbot-title p {
        margin: 0;
        font-size: 12px;
        opacity: 0.9;
      }

      .webit-chatbot-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: background 0.3s ease;
        flex-shrink: 0;
      }

      .webit-chatbot-close:hover {
        background: rgba(255,255,255,0.3);
      }

      .webit-chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f5f5f5;
        scroll-behavior: smooth;
      }

      .webit-chatbot-message {
        margin-bottom: 14px;
        display: flex;
      }

      .webit-chatbot-message.user {
        justify-content: flex-end;
      }

      .webit-chatbot-message.assistant {
        justify-content: flex-start;
      }

      .webit-chatbot-message-content {
        max-width: 82%;
        padding: 11px 14px;
        border-radius: 16px;
        font-size: 13.5px;
        line-height: 1.55;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .webit-chatbot-message.user .webit-chatbot-message-content {
        background: ${CHATBOT_CONFIG.colors.primary};
        color: white;
        border-bottom-right-radius: 4px;
      }

      .webit-chatbot-message.assistant .webit-chatbot-message-content {
        background: white;
        color: #333;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        border-bottom-left-radius: 4px;
      }

      .webit-chatbot-message-content a {
        color: ${CHATBOT_CONFIG.colors.primary};
        text-decoration: underline;
      }
      .webit-chatbot-message.user .webit-chatbot-message-content a {
        color: #fff;
      }

      /* Mise en forme du markdown simple */
      .webit-chatbot-message-content strong {
        font-weight: 700;
      }

      .webit-chatbot-loading {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
        background: white;
        border-radius: 16px;
        max-width: 80px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      }

      .webit-chatbot-loading-dot {
        width: 8px;
        height: 8px;
        background: ${CHATBOT_CONFIG.colors.primary};
        border-radius: 50%;
        animation: webit-bounce 1.2s infinite ease-in-out both;
      }

      .webit-chatbot-loading-dot:nth-child(1) { animation-delay: -0.32s; }
      .webit-chatbot-loading-dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes webit-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      .webit-chatbot-input-container {
        padding: 14px 16px;
        background: white;
        border-top: 1px solid #e8e8e8;
        flex-shrink: 0;
      }

      .webit-chatbot-input-form {
        display: flex;
        gap: 8px;
      }

      .webit-chatbot-input {
        flex: 1;
        padding: 11px 14px;
        border: 1.5px solid #ddd;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
        font-family: inherit;
      }

      .webit-chatbot-input:focus {
        border-color: ${CHATBOT_CONFIG.colors.primary};
      }

      .webit-chatbot-send {
        background: ${CHATBOT_CONFIG.colors.primary};
        color: white;
        border: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.25s ease, transform 0.15s ease;
        flex-shrink: 0;
      }

      .webit-chatbot-send:hover:not(:disabled) {
        background: ${CHATBOT_CONFIG.colors.secondary};
        transform: scale(1.05);
      }

      .webit-chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .webit-chatbot-footer {
        padding: 7px 16px;
        text-align: center;
        font-size: 11px;
        color: #aaa;
        background: #fafafa;
        border-top: 1px solid #efefef;
        flex-shrink: 0;
      }

      .webit-chatbot-footer a {
        color: ${CHATBOT_CONFIG.colors.primary};
        text-decoration: none;
      }

      .webit-chatbot-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 8px 14px 10px;
        background: #f5f5f5;
        border-top: 1px solid #ebebeb;
        flex-shrink: 0;
      }

      .webit-chatbot-suggestion {
        background: white;
        border: 1.5px solid #ddd;
        border-radius: 16px;
        padding: 5px 11px;
        font-size: 12px;
        cursor: pointer;
        color: ${CHATBOT_CONFIG.colors.primary};
        transition: all 0.2s;
        white-space: nowrap;
        font-family: inherit;
      }

      .webit-chatbot-suggestion:hover {
        background: ${CHATBOT_CONFIG.colors.primary};
        color: white;
        border-color: ${CHATBOT_CONFIG.colors.primary};
      }

      @media (max-width: 420px) {
        .webit-chatbot-window {
          width: calc(100vw - 16px);
          right: 8px;
          bottom: 8px;
          height: 90vh;
          max-height: 600px;
          border-radius: 14px;
        }
        .webit-chatbot-button {
          bottom: 16px;
          right: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  createChatWidget() {
    const button = document.createElement('button');
    button.className = 'webit-chatbot-button';
    button.setAttribute('aria-label', 'Ouvrir le chat');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.67-.33-3.82-.91l-.27-.16-2.91.49.49-2.91-.16-.27C4.33 14.67 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4-9h-3V8c0-.55-.45-1-1-1s-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1z"/>
      </svg>
      <div class="webit-chatbot-badge">IA</div>
    `;
    button.onclick = () => this.toggle();

    const suggestions = [
      'Vos services réseau',
      'Sécurité Fortinet',
      'Intégration Starlink',
      'Intervention au Gabon',
      'Demander un devis'
    ];

    const chatWindow = document.createElement('div');
    chatWindow.className = 'webit-chatbot-window';
    chatWindow.innerHTML = `
      <div class="webit-chatbot-header">
        <div class="webit-chatbot-header-info">
          <div class="webit-chatbot-avatar">🤖</div>
          <div class="webit-chatbot-title">
            <h3>Assistant Webit-AI</h3>
            <p>Répond instantanément</p>
          </div>
        </div>
        <button class="webit-chatbot-close" aria-label="Fermer">✕</button>
      </div>
      <div class="webit-chatbot-messages" id="webit-chatbot-messages"></div>
      <div class="webit-chatbot-suggestions" id="webit-chatbot-suggestions">
        ${suggestions.map(s => `<button class="webit-chatbot-suggestion">${s}</button>`).join('')}
      </div>
      <div class="webit-chatbot-input-container">
        <form class="webit-chatbot-input-form" id="webit-chatbot-form">
          <input
            type="text"
            class="webit-chatbot-input"
            id="webit-chatbot-input"
            placeholder="Posez votre question..."
            autocomplete="off"
            maxlength="500"
          />
          <button type="submit" class="webit-chatbot-send" id="webit-chatbot-send" aria-label="Envoyer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
      <div class="webit-chatbot-footer">
        Contact direct → <a href="mailto:contact@webit-ai.com">contact@webit-ai.com</a>
      </div>
    `;

    document.body.appendChild(button);
    document.body.appendChild(chatWindow);

    this.elements = {
      button,
      window: chatWindow,
      messages: document.getElementById('webit-chatbot-messages'),
      suggestions: document.getElementById('webit-chatbot-suggestions'),
      form: document.getElementById('webit-chatbot-form'),
      input: document.getElementById('webit-chatbot-input'),
      send: document.getElementById('webit-chatbot-send')
    };

    this.renderMessages();

    this.elements.suggestions.querySelectorAll('.webit-chatbot-suggestion').forEach(btn => {
      btn.onclick = () => {
        this.elements.input.value = btn.textContent;
        this.elements.suggestions.style.display = 'none';
        this.elements.form.dispatchEvent(new Event('submit', { cancelable: true }));
      };
    });
  }

  attachEventListeners() {
    this.elements.window.querySelector('.webit-chatbot-close').onclick = () => this.toggle();
    this.elements.form.onsubmit = (e) => this.sendMessage(e);

    this.elements.input.addEventListener('input', () => {
      if (this.elements.input.value.length > 0) {
        this.elements.suggestions.style.display = 'none';
      }
    });

    // Fermer en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
      if (this.isOpen &&
          !this.elements.window.contains(e.target) &&
          !this.elements.button.contains(e.target)) {
        this.toggle();
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.elements.window.classList.toggle('open', this.isOpen);
    this.elements.button.style.display = this.isOpen ? 'none' : 'flex';
    if (this.isOpen) {
      setTimeout(() => this.elements.input.focus(), 100);
      this.scrollToBottom();
    }
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  formatMessage(text) {
    return this.escapeHtml(text)
      // Gras **texte**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // URLs cliquables
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      // Emails cliquables
      .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
  }

  renderMessages() {
    this.elements.messages.innerHTML = this.messages.map(msg => `
      <div class="webit-chatbot-message ${msg.role}">
        <div class="webit-chatbot-message-content">${this.formatMessage(msg.content)}</div>
      </div>
    `).join('');
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  }

  showLoading() {
    const loading = document.createElement('div');
    loading.className = 'webit-chatbot-message assistant';
    loading.id = 'webit-loading';
    loading.innerHTML = `
      <div class="webit-chatbot-loading">
        <div class="webit-chatbot-loading-dot"></div>
        <div class="webit-chatbot-loading-dot"></div>
        <div class="webit-chatbot-loading-dot"></div>
      </div>
    `;
    this.elements.messages.appendChild(loading);
    this.scrollToBottom();
  }

  hideLoading() {
    const loading = document.getElementById('webit-loading');
    if (loading) loading.remove();
  }

  async sendMessage(e) {
    e.preventDefault();

    const message = this.elements.input.value.trim();
    if (!message) return;

    this.elements.suggestions.style.display = 'none';
    this.messages.push({ role: 'user', content: message });
    this.renderMessages();
    this.elements.input.value = '';
    this.elements.send.disabled = true;

    this.showLoading();

    // Délai naturel pour simuler la réflexion (400–900 ms)
    const delay = 400 + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    this.hideLoading();

    const response = getLocalResponse(message);
    this.messages.push({ role: 'assistant', content: response });
    this.renderMessages();

    this.elements.send.disabled = false;
    this.elements.input.focus();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WebitChatbot());
} else {
  new WebitChatbot();
}
