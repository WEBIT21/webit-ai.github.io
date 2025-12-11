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
        content: "Bonjour ! 👋\n\nJe suis l'assistant virtuel de Webit-AI.\n\nComment puis-je vous aider concernant nos services informatiques ?"
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
      .webit-chatbot-button {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${CHATBOT_CONFIG.colors.secondary} 0%, ${CHATBOT_CONFIG.colors.primary} 100%);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .webit-chatbot-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }
      .webit-chatbot-button svg {
        width: 32px;
        height: 32px;
        fill: white;
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
      }
      .webit-chatbot-message.assistant .webit-chatbot-message-content {
        background: white;
        color: #333;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    `;
    document.head.appendChild(style);
  }

  createChatWidget() {
    const button = document.createElement('button');
    button.className = 'webit-chatbot-button';
    button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    `;
    button.onclick = () => this.toggle();

    const window = document.createElement('div');
    window.className = 'webit-chatbot-window';
    window.innerHTML = `
      <div class="webit-chatbot-header">
        <div class="webit-chatbot-header-info">
          <div class="webit-chatbot-avatar">🤖</div>
          <div class="webit-chatbot-title">
            <h3>Assistant Webit-AI</h3>
            <p>En ligne</p>
          </div>
        </div>
        <button class="webit-chatbot-close">✕</button>
      </div>
      <div class="webit-chatbot-messages" id="webit-chatbot-messages"></div>
      <div class="webit-chatbot-input-container">
        <form class="webit-chatbot-input-form" id="webit-chatbot-form">
          <input 
            type="text" 
            class="webit-chatbot-input" 
            id="webit-chatbot-input"
            placeholder="Posez votre question..."
            autocomplete="off"
          />
          <button type="submit" class="webit-chatbot-send" id="webit-chatbot-send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
      <div class="webit-chatbot-footer">
        Questions ? → <a href="mailto:contact@webit-ai.com">contact@webit-ai.com</a>
      </div>
    `;

    document.body.appendChild(button);
    document.body.appendChild(window);

    this.elements = {
      button,
      window,
      messages: document.getElementById('webit-chatbot-messages'),
      form: document.getElementById('webit-chatbot-form'),
      input: document.getElementById('webit-chatbot-input'),
      send: document.getElementById('webit-chatbot-send')
    };

    this.renderMessages();
  }

  attachEventListeners() {
    this.elements.window.querySelector('.webit-chatbot-close').onclick = () => this.toggle();
    this.elements.form.onsubmit = (e) => this.sendMessage(e);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.elements.window.classList.toggle('open', this.isOpen);
    this.elements.button.style.display = this.isOpen ? 'none' : 'flex';
    if (this.isOpen) {
      this.elements.input.focus();
    }
  }

  renderMessages() {
    this.elements.messages.innerHTML = this.messages.map(msg => `
      <div class="webit-chatbot-message ${msg.role}">
        <div class="webit-chatbot-message-content">${msg.content}</div>
      </div>
    `).join('');
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  }

  showLoading() {
    const loading = document.createElement('div');
    loading.className = 'webit-chatbot-message assistant';
    loading.innerHTML = `
      <div class="webit-chatbot-loading">
        <div class="webit-chatbot-loading-dot"></div>
        <div class="webit-chatbot-loading-dot"></div>
        <div class="webit-chatbot-loading-dot"></div>
      </div>
    `;
    loading.id = 'webit-loading';
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

    this.messages.push({ role: 'user', content: message });
    this.renderMessages();
    this.elements.input.value = '';
    this.elements.send.disabled = true;

    this.showLoading();

    try {
      const response = await fetch(`${CHATBOT_CONFIG.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      this.hideLoading();
      
      if (data.success) {
        this.messages.push({ role: 'assistant', content: data.response });
      } else {
        this.messages.push({ 
          role: 'assistant', 
          content: 'Erreur technique. Contactez contact@webit-ai.com' 
        });
      }
      
      this.renderMessages();

    } catch (error) {
      console.error('Erreur:', error);
      this.hideLoading();
      this.messages.push({ 
        role: 'assistant', 
        content: 'Erreur de connexion. Contactez contact@webit-ai.com' 
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
