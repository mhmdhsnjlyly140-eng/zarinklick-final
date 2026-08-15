// ============================================
// چت‌بات هوش مصنوعی زرین‌کلیک
// ============================================

// ============================================
// 1. پاسخ‌های از پیش تعیین شده
// ============================================
const chatbotResponses = {
    // سوالات عمومی
    "سلام": "سلام! 👋 به زرین‌کلیک خوش آمدید. چطور می‌توانم کمک کنم؟",
    "خوبی": "سلام! عالی هستم. شما چطورید؟ 😊",
    "چطوری": "سلام! عالی هستم. شما چطورید؟ 😊",
    "ممنون": "خواهش می‌کنم! 🌟 خوشحالم که می‌توانم کمک کنم.",
    "متشکرم": "خواهش می‌کنم! 🌟",
    
    // ثبت نام
    "ثبت نام": "برای ثبت نام، روی دکمه 'ثبت نام' در صفحه ورود کلیک کنید. ایمیل، رمز (حداقل ۶ کاراکتر) و شماره موبایل خود را وارد کنید.",
    "عضویت": "برای ثبت نام، روی دکمه 'ثبت نام' در صفحه ورود کلیک کنید.",
    
    // ورود
    "ورود": "برای ورود، ایمیل و رمز عبور خود را در صفحه ورود وارد کنید و روی دکمه 'ورود' کلیک کنید.",
    "لاگین": "برای ورود، ایمیل و رمز عبور خود را در صفحه ورود وارد کنید.",
    
    // کلیک
    "کلیک": "برای کلیک روی تبلیغات، به صفحه خانه بروید و روی دکمه 'کلیک کن و X تومان بگیر!' کلیک کنید. هر کلیک به شما پاداش می‌دهد.",
    "تبلیغ": "برای کلیک روی تبلیغات، به صفحه خانه بروید و روی دکمه کلیک کنید. هر کلیک پاداش دارد.",
    "درآمد": "با کلیک روی تبلیغات می‌توانید درآمد کسب کنید. هر کلیک بین ۱۰۰ تا ۳۰۰ تومان پاداش دارد.",
    "پول": "با کلیک روی تبلیغات پول کسب کنید. هر کلیک پاداش دارد و پول به کیف پول شما اضافه می‌شود.",
    
    // کیف پول
    "کیف پول": "موجودی کیف پول خود را در صفحه خانه یا داشبورد مشاهده کنید. از کیف پول می‌توانید برای ثبت تبلیغ یا برداشت استفاده کنید.",
    "موجودی": "موجودی کیف پول خود را در صفحه خانه یا داشبورد مشاهده کنید.",
    "شارژ": "برای شارژ کیف پول، از کد شارژ استفاده کنید یا از طریق زرین‌پال پرداخت انجام دهید.",
    
    // برداشت
    "برداشت": "برای برداشت وجه، به داشبورد بروید و مبلغ مورد نظر را وارد کنید. حداقل مبلغ برداشت ۱۰۰,۰۰۰ تومان است.",
    "پول گرفتن": "برای برداشت وجه، به داشبورد بروید و مبلغ مورد نظر را وارد کنید.",
    
    // تیکت
    "تیکت": "برای ارسال تیکت، به صفحه حساب کاربری بروید و موضوع و پیام خود را وارد کنید. ادمین به شما پاسخ خواهد داد.",
    "پشتیبانی": "برای تماس با پشتیبانی، از بخش تیکت در صفحه حساب کاربری استفاده کنید یا با شماره ۰۹۰۵۲۳۸۰۷۰۶ تماس بگیرید.",
    "سوال": "سوال خود را بپرسید! من اینجا هستم تا کمک کنم. 🤖",
    
    // قوانین
    "قوانین": "قوانین زرین‌کلیک: ۱. هر کاربر فقط یک حساب ۲. کلیک تقلبی ممنوع ۳. تبلیغات خلاف قوانین اسلامی ممنوع ۴. اطلاعات کاربران محرمانه است.",
    "قانون": "قوانین زرین‌کلیک را در صفحه 'درباره ما' مشاهده کنید.",
    
    // خداحافظی
    "خداحافظ": "خداحافظ! 🌟 خوشحالم که کمک کردم. هر سوالی داشتید، خوش آمدید!",
    "خدا حافظ": "خداحافظ! 🌟 خوشحالم که کمک کردم.",
};

// ============================================
// 2. تابع اصلی چت‌بات
// ============================================
function getChatbotResponse(message) {
    const cleanMessage = message.trim().toLowerCase();
    
    for (const [key, response] of Object.entries(chatbotResponses)) {
        if (cleanMessage.includes(key.toLowerCase())) {
            return response;
        }
    }
    
    return "🤖 متوجه سوالتون نشدم! لطفاً واضح‌تر بپرسید. می‌تونید از من درباره ثبت نام، کلیک، کیف پول، برداشت، تیکت یا قوانین بپرسید.";
}

// ============================================
// 3. نمایش چت‌بات
// ============================================
function showChatbot() {
    const existing = document.getElementById('chatbotContainer');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'chatbotContainer';
    container.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 10px;
        width: 320px;
        max-height: 450px;
        background: #141a2b;
        border: 2px solid #f7971e;
        border-radius: 16px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 40px rgba(0,0,0,0.8);
        overflow: hidden;
    `;

    container.innerHTML = `
        <div style="background:#1f2942;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2a3457;">
            <span style="color:#ffd200;font-weight:700;">🤖 زرین‌بات</span>
            <button onclick="closeChatbot()" style="background:none;border:none;color:#ff6b6b;font-size:18px;cursor:pointer;padding:0 8px;width:auto;">✕</button>
        </div>
        <div id="chatMessages" style="flex:1;padding:12px;overflow-y:auto;max-height:300px;min-height:200px;">
            <div style="background:#0f1422;padding:10px;border-radius:10px;margin-bottom:8px;max-width:85%;border-right:3px solid #f7971e;">
                <span style="color:#8892b0;font-size:11px;">🤖 زرین‌بات</span>
                <p style="color:#fff;font-size:14px;margin-top:4px;">سلام! 👋 به زرین‌کلیک خوش آمدید. سوالی دارید؟ بپرسید!</p>
            </div>
        </div>
        <div style="padding:10px;border-top:1px solid #2a3457;display:flex;gap:8px;">
            <input type="text" id="chatInput" placeholder="سوال خود را بپرسید..." style="flex:1;padding:10px;border-radius:10px;border:none;background:#0f1422;color:#fff;font-size:14px;outline:1px solid #2a3457;">
            <button onclick="sendChatMessage()" style="padding:10px 16px;background:linear-gradient(135deg,#f7971e,#ffd200);color:#0b0e1a;border:none;border-radius:10px;font-weight:700;cursor:pointer;width:auto;">📤</button>
        </div>
    `;

    document.body.appendChild(container);

    setTimeout(() => {
        const input = document.getElementById('chatInput');
        if (input) input.focus();
    }, 300);

    document.getElementById('chatInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

// ============================================
// 4. بستن چت‌بات
// ============================================
function closeChatbot() {
    const container = document.getElementById('chatbotContainer');
    if (container) container.remove();
}

// ============================================
// 5. ارسال پیام
// ============================================
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    
    if (!input || !messages) return;
    
    const userMessage = input.value.trim();
    if (!userMessage) return;
    
    const userDiv = document.createElement('div');
    userDiv.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:8px;';
    userDiv.innerHTML = `
        <div style="background:#f7971e;padding:10px;border-radius:10px;max-width:85%;">
            <span style="color:#0b0e1a;font-size:11px;">👤 شما</span>
            <p style="color:#0b0e1a;font-size:14px;margin-top:4px;">${userMessage}</p>
        </div>
    `;
    messages.appendChild(userDiv);
    
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    const response = getChatbotResponse(userMessage);
    
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.style.cssText = 'display:flex;justify-content:flex-start;margin-bottom:8px;';
        botDiv.innerHTML = `
            <div style="background:#0f1422;padding:10px;border-radius:10px;max-width:85%;border-right:3px solid #f7971e;">
                <span style="color:#8892b0;font-size:11px;">🤖 زرین‌بات</span>
                <p style="color:#fff;font-size:14px;margin-top:4px;">${response}</p>
            </div>
        `;
        messages.appendChild(botDiv);
        messages.scrollTop = messages.scrollHeight;
    }, 500);
}

// ============================================
// 6. دکمه چت‌بات
// ============================================
function addChatbotButton() {
    const btn = document.createElement('button');
    btn.id = 'chatbotToggle';
    btn.innerHTML = '🤖';
    btn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 15px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f7971e, #ffd200);
        border: none;
        font-size: 28px;
        cursor: pointer;
        z-index: 9998;
        box-shadow: 0 4px 20px rgba(247, 151, 30, 0.4);
        transition: all 0.3s ease;
    `;
    btn.onmouseover = () => { btn.style.transform = 'scale(1.1)'; };
    btn.onmouseout = () => { btn.style.transform = 'scale(1)'; };
    btn.onclick = showChatbot;
    document.body.appendChild(btn);
}

// ============================================
// 7. شروع چت‌بات
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        addChatbotButton();
    }
});
