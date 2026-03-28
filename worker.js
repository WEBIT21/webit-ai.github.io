/**
 * Webit AI – Cloudflare Worker
 * ─────────────────────────────────────────────────────────────
 * DÉPLOIEMENT :
 *   1. Aller sur https://workers.cloudflare.com/ → Créer un Worker
 *   2. Coller ce fichier entier
 *   3. Settings → Variables → Ajouter : ANTHROPIC_API_KEY = sk-ant-...
 *   4. Sauvegarder & Déployer
 *   5. Copier l'URL du Worker (ex: https://webit-chatbot.TON-PSEUDO.workers.dev)
 *   6. Coller cette URL dans chatbot.js → CHATBOT_CONFIG.workerUrl
 * ─────────────────────────────────────────────────────────────
 */

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de Webit AI, une SSII française experte en infrastructure IT.

SERVICES:
• Administration Système : Windows Server, Active Directory, Linux (RedHat/Ubuntu/CentOS), VMware, Hyper-V, Proxmox, monitoring, sauvegardes/PRA
• Infrastructure Réseau : LAN/WAN, VLAN, Cisco, Aruba, HP, VPN multi-sites, SD-WAN, F5 Load Balancing
• Sécurité Informatique : Fortinet FortiGate (Integrator Partner CERTIFIÉ), Palo Alto, EDR SentinelOne/Wazuh, audits, RGPD, ISO27001
• WiFi Professionnel : Site Survey Ekahau, Aruba, Cisco Meraki, Ruckus, 802.1X, Aruba Central
• Vidéosurveillance IP : Caméras 4K/8MP, NVR, analyse vidéo IA, accès distant sécurisé
• Cloud & Automatisation : Azure, AWS, GCP, Ansible/AWX, Terraform, Infrastructure as Code, DevOps, CI/CD
• Starlink Business : Déploiement terrain en France (Île-de-France) et au Gabon (Libreville)

INFOGÉRANCE MSP : contrats sur mesure, supervision 24/7, helpdesk, SLA personnalisé
ZONES : France (Île-de-France) et Gabon (Libreville et région)
CONTACT : contact@webit-ai.com | +33 6 15 19 76 25
RÉFÉRENCES : BAA Training (aviation, multi-sites), Groupe ADP – Aéroports de Paris, Acorus (facility management)
PARTENAIRES CERTIFIÉS : Fortinet Integrator Partner, Bitdefender, Ingram Micro, Ekahau

RÈGLES STRICTES :
- Réponds TOUJOURS en français, de façon professionnelle et bienveillante
- Sois CONCIS : 80 mots maximum sauf si l'utilisateur demande des détails précis
- N'invente JAMAIS de prix ni de délais chiffrés
- Ne mentionne JAMAIS Claude, Anthropic ou le nom d'une IA externe
- Si le message contient [ZONE: Gabon], adapte la réponse avec les spécificités Gabon (Starlink, déplacements, Libreville)
- Si le message contient [ZONE: France], mets en avant Île-de-France et interventions rapides
- Pour toute demande de devis ou de contact : dis qu'un formulaire va apparaître directement dans le chat`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    return new Response('Not Found', { status: 404, headers: CORS });
  }
};

async function handleChat(request, env) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string' || message.length > 1000) {
      return json({ success: false, error: 'Message invalide' }, 400);
    }

    const messages = [
      ...(Array.isArray(history) ? history.slice(-8) : []),
      { role: 'user', content: message }
    ];

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Anthropic error:', res.status, err);
      return json({ success: false, error: 'Service IA indisponible' }, 502);
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text ?? '';

    return json({ success: true, response: reply });

  } catch (err) {
    console.error('Worker error:', err);
    return json({ success: false, error: 'Erreur serveur' }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' }
  });
}
