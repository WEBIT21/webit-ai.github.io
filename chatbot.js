// Configuration
const CHATBOT_CONFIG = {
  apiUrl: 'https://ai.webit-ai.com',
  colors: {
    primary: '#3A75C4',
    secondary: '#009E60',
    accent: '#FCD116'
  }
};

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
      @keyframes pulse {
        0%, 100% { 
          transform: scale(1); 
          box-shadow: 0 0 0 0 rgba(0, 158, 96, 0.7); 
        }
        50% { 
          transform: scale(1.05); 
          box-shadow: 0 0 0 10px rgba(0, 158, 96, 0); 
        }
      }
      
      @keyframes float {
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
        background-size: 200% 200%;
        border: none;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        animation: pulse 2s infinite, float 3s ease-in-out infinite;
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
      
      .webit-chatbot-button::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${CHATBOT_CONFIG.colors.secondary}, ${CHATBOT_CONFIG.colors.accent}, ${CHATBOT_CONFIG.colors.primary});
        opacity: 0;
        z-index: -1;
        transition: opacity 0.3s ease;
        filter: blur(10px);
      }
      
      .webit-chatbot-button:hover::before {
        opacity: 1;
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
        animation: pulse 2s infinite;
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
      }
      
      .webit-chatbot-close:hover {
        background: rgba(255,255,255,0.3);
      }
      
      .webit-chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f5f5f5;
      }
      
      .webit-chatbot-message {
        margin-bottom: 16px;
        display: flex;
      }
      
      .webit-chatbot-message.user {
        justify-content: flex-end;
      }
      
      .webit-chatbot-message.assistant {
        justify-content: flex-start;
      }
      
      .webit-chatbot-message-content {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.5;
        white-space: pre-wrap;
      }
      
      .webit-chatbot-message.user .webit-chatbot-message-content {
        background: ${CHATBOT_CONFIG.colors.primary};
        color: white;
        border-bottom-right-radius: 4px;
      }
      
      .webit-chatbot-message.assistant .webit-chatbot-message-content {
        background: white;
        color: #333;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-bottom-left-radius: 4px;
      }

      /* Lien dans les messages */
      .webit-chatbot-message-content a {
        color: ${CHATBOT_CONFIG.colors.primary};
        text-decoration: underline;
      }
      .webit-chatbot-message.user .webit-chatbot-message-content a {
        color: #fff;
      }
      
      .webit-chatbot-loading {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
        background: white;
        border-radius: 16px;
        max-width: 80px;
      }
      
      .webit-chatbot-loading-dot {
        width: 8px;
        height: 8px;
        background: ${CHATBOT_CONFIG.colors.primary};
        border-radius: 50%;
        animation: webit-bounce 1.4s infinite ease-in-out both;
      }
      
      .webit-chatbot-loading-dot:nth-child(1) { animation-delay: -0.32s; }
      .webit-chatbot-loading-dot:nth-child(2) { animation-delay: -0.16s; }
      
      @keyframes webit-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      
      .webit-chatbot-input-container {
        padding: 16px;
        background: white;
        border-top: 1px solid #e0e0e0;
      }
      
      .webit-chatbot-input-form {
        display: flex;
        gap: 8px;
      }
      
      .webit-chatbot-input {
        flex: 1;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
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
        transition: background 0.3s ease;
        flex-shrink: 0;
      }
      
      .webit-chatbot-send:hover:not(:disabled) {
        background: ${CHATBOT_CONFIG.colors.secondary};
      }
      
      .webit-chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .webit-chatbot-footer {
        padding: 8px 16px;
        text-align: center;
        font-size: 11px;
        color: #999;
        background: #f9f9f9;
        border-top: 1px solid #e0e0e0;
      }
      
      .webit-chatbot-footer a {
        color: ${CHATBOT_CONFIG.colors.primary};
        text-decoration: none;
      }

      /* Suggestions rapides */
      .webit-chatbot-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 0 16px 12px;
        background: #f5f5f5;
      }

      .webit-chatbot-suggestion {
        background: white;
        border: 1px solid #ddd;
        border-radius: 16px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        color: ${CHATBOT_CONFIG.colors.primary};
        transition: all 0.2s;
        white-space: nowrap;
      }

      .webit-chatbot-suggestion:hover {
        background: ${CHATBOT_CONFIG.colors.primary};
        color: white;
        border-color: ${CHATBOT_CONFIG.colors.primary};
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

    // Suggestions de départ
    const suggestions = [
      'Vos services réseau',
      'Intégration Starlink',
      'Intervention au Gabon',
      'Demander un devis',
      'Partenariat Fortinet'
    ];

    const chatWindow = document.createElement('div');
    chatWindow.className = 'webit-chatbot-window';
    chatWindow.innerHTML = `
      <div class="webit-chatbot-header">
        <div class="webit-chatbot-header-info">
          <div class="webit-chatbot-avatar">🤖</div>
          <div class="webit-chatbot-title">
            <h3>Assistant Webit-AI</h3>
            <p>Répond en quelques secondes</p>
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
        Questions directes → <a href="mailto:contact@webit-ai.com">contact@webit-ai.com</a>
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

    // Suggestions cliquables
    this.elements.suggestions.querySelectorAll('.webit-chatbot-suggestion').forEach(btn => {
      btn.onclick = () => {
        this.elements.input.value = btn.textContent;
        // Masquer les suggestions après utilisation
        this.elements.suggestions.style.display = 'none';
        this.elements.form.dispatchEvent(new Event('submit', { cancelable: true }));
      };
    });
  }

  attachEventListeners() {
    this.elements.window.querySelector('.webit-chatbot-close').onclick = () => this.toggle();
    this.elements.form.onsubmit = (e) => this.sendMessage(e);

    // Masquer suggestions dès que l'utilisateur tape
    this.elements.input.addEventListener('input', () => {
      if (this.elements.input.value.length > 0) {
        this.elements.suggestions.style.display = 'none';
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.elements.window.classList.toggle('open', this.isOpen);
    this.elements.button.style.display = this.isOpen ? 'none' : 'flex';
    if (this.isOpen) {
      setTimeout(() => this.elements.input.focus(), 100);
    }
  }

  renderMessages() {
    this.elements.messages.innerHTML = this.messages.map(msg => `
      <div class="webit-chatbot-message ${msg.role}">
        <div class="webit-chatbot-message-content">${this.escapeHtml(msg.content)}</div>
      </div>
    `).join('');
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      // Transformer les URLs en liens cliquables
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      // Transformer les emails en liens
      .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
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
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  }

  hideLoading() {
    const loading = document.getElementById('webit-loading');
    if (loading) loading.remove();
  }

  async sendMessage(e) {
    e.preventDefault();
    
    const message = this.elements.input.value.trim();
    if (!message) return;

    // Masquer suggestions définitivement après premier envoi
    this.elements.suggestions.style.display = 'none';

    this.messages.push({ role: 'user', content: message });
    this.renderMessages();
    this.elements.input.value = '';
    this.elements.send.disabled = true;

    this.showLoading();

    try {
      // ✅ On envoie l'historique complet pour que le backend maintienne le contexte
      const conversationHistory = this.messages
        .filter(m => m.role !== 'assistant' || this.messages.indexOf(m) > 0) // exclure le message d'accueil du contexte API
        .slice(-10) // limiter aux 10 derniers messages pour éviter les tokens inutiles
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${CHATBOT_CONFIG.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,                          // dernier message utilisateur
          history: conversationHistory      // historique complet
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      
      this.hideLoading();
      
      if (data.success) {
        this.messages.push({ role: 'assistant', content: data.response });
      } else {
        this.messages.push({ 
          role: 'assistant', 
          content: 'Une erreur technique est survenue. Contactez directement contact@webit-ai.com' 
        });
      }
      
      this.renderMessages();

    } catch (error) {
      console.error('Chatbot error:', error);
      this.hideLoading();
      this.messages.push({ 
        role: 'assistant', 
        content: 'Impossible de joindre le serveur. Contactez directement contact@webit-ai.com ou appelez le +33 6 15 19 76 25.' 
      });
      this.renderMessages();
    } finally {
      this.elements.send.disabled = false;
      this.elements.input.focus();
    }
  }
}

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WebitChatbot());
} else {
  new WebitChatbot();
}
