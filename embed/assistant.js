// backend/embed/assistant.js
(function () {
  const scriptTag = document.currentScript;
  const shopId = scriptTag.getAttribute("data-shop");

  if (!shopId) {
    console.error("AI Assistant: data-shop attribute is required!");
    return;
  }

  // ---- Bazı yardımcı fonksiyonlar ----
  function createEl(tag, style = {}) {
    const el = document.createElement(tag);
    Object.assign(el.style, style);
    return el;
  }

  function addMessage(role, text) {
    const box = document.getElementById("chat-box");
    if (!box) return;

    const wrapper = document.createElement("div");
    wrapper.style.margin = "6px 0";
    wrapper.style.textAlign = role === "user" ? "right" : "left";

    const strong = document.createElement("strong");
    strong.innerText = role === "user" ? "Siz: " : "Asistan: ";

    const span = document.createElement("span");
    span.innerText = text;

    wrapper.appendChild(strong);
    wrapper.appendChild(span);
    box.appendChild(wrapper);
    box.scrollTop = box.scrollHeight;
  }

  // ---- Sohbet balonu ----
  const bubble = createEl("div", {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    background: "#2563eb",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: "99999",
    fontSize: "28px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  });
  bubble.id = "ai-assistant-bubble";
  bubble.innerText = "💬";

  document.body.appendChild(bubble);

  // ---- Popup ----
  const popup = createEl("div", {
    position: "fixed",
    bottom: "100px",
    right: "20px",
    width: "340px",
    height: "460px",
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "none",
    flexDirection: "column",
    zIndex: "99999",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  });
  popup.id = "ai-assistant-popup";

  popup.innerHTML = `
    <div style="background:#2563eb;color:white;padding:10px;border-radius:10px 10px 0 0;
                display:flex;align-items:center;justify-content:space-between;">
      <strong>AI Asistanı</strong>
      <span id="ai-assistant-close" style="cursor:pointer;font-size:16px;">✕</span>
    </div>
    <div id="chat-box" style="flex:1; padding:10px; overflow-y:auto; font-size:14px;
                              background:#f9fafb;"></div>
    <div id="chat-input-area" style="padding:8px; border-top:1px solid #ddd; display:flex; flex-direction:column; gap:6px;">
      <div style="display:flex; gap:4px;">
        <input id="chat-input" type="text" placeholder="Mesaj yazın..."
          style="flex:1; padding:8px; border:1px solid #ccc; border-radius:5px; font-size:13px;">
        <button id="chat-send" style="padding:8px 10px; font-size:13px; cursor:pointer; border:none;
                                      border-radius:5px; background:#2563eb; color:white;">
          Gönder
        </button>
      </div>
      <button id="chat-image" style="padding:6px 8px; font-size:12px; cursor:pointer; border:1px dashed #2563eb;
                                     border-radius:5px; background:#eef2ff; color:#2563eb; text-align:center;">
        📷 Görsel URL ile analiz et
      </button>
    </div>
  `;

  document.body.appendChild(popup);

  const closeBtn = document.getElementById("ai-assistant-close");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send");
  const chatImageBtn = document.getElementById("chat-image");

  // Popup aç/kapa
  bubble.onclick = () => {
    popup.style.display = popup.style.display === "none" ? "flex" : "none";
  };
  closeBtn.onclick = () => {
    popup.style.display = "none";
  };

  // Mağaza AI prompt'unu yükle
  window.AI_PROMPT = "";
  fetch(`http://localhost:4000/api/shop/${shopId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.shop && data.shop.aiPrompt) {
        window.AI_PROMPT = data.shop.aiPrompt;
      }
    })
    .catch(() => {});

  // ---- METİN MESAJ GÖNDERME ----
  async function sendMessage() {
    const value = chatInput.value.trim();
    if (!value) return;

    addMessage("user", value);
    chatInput.value = "";

    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          message: value,
          aiPrompt: window.AI_PROMPT,
        }),
      });

      const data = await response.json();
      addMessage("ai", data.reply || "AI şu anda yanıt veremiyor, tekrar deneyin.");
    } catch (err) {
      console.error("Chat error:", err);
      addMessage("ai", "Sunucuya bağlanılamadı.");
    }
  }

  chatSendBtn.onclick = sendMessage;
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // ---- GÖRSEL ANALİZ MESAJI GÖNDERME ----
  async function sendImageToAI(imageUrl) {
    if (!imageUrl) return;

    addMessage("user", `Görsel analizi isteği: ${imageUrl}`);

    try {
      const response = await fetch("http://localhost:4000/api/chat/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          imageUrl,
          aiPrompt: window.AI_PROMPT,
        }),
      });

      const data = await response.json();
      addMessage("ai", data.reply || "Görsel analiz edilemedi, lütfen tekrar deneyin.");
    } catch (err) {
      console.error("Image chat error:", err);
      addMessage("ai", "Görsel analiz servisine ulaşılamadı.");
    }
  }

  chatImageBtn.onclick = () => {
    const url = prompt("Analiz etmek istediğiniz ürün görselinin URL'sini girin:");
    if (!url) return;
    sendImageToAI(url);
  };
})();
