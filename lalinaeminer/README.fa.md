# La Lineae Miner — فاز اول (اسکلت اجرایی)

این پروژه یک اسکلت اولیه برای Telegram Mini App با Cloudflare Pages + Worker + D1 است.
این نسخه **دموی امنِ اولیه** است: پرداخت واقعی، قیمت زنده، استخراج واقعی روی بلاکچین و اتصال نهایی ربات هنوز پیاده‌سازی/فعال نشده‌اند.

## پیش‌نیازها
- Node.js نسخه LTS
- حساب Cloudflare
- Wrangler CLI
- ربات موجود تلگرام
- فایل اصلی لوگو/سکه برای قرار دادن در `public/assets/`

## ساختار
- `public/`: رابط موبایل ساده
- `src/worker.js`: API اولیه و اعتبارسنجی Telegram initData
- `schema.sql`: ساختار اولیه D1
- `wrangler.toml`: تنظیمات نمونه Worker و D1

## راه‌اندازی محلی
```bash
npm install
npx wrangler login
npx wrangler d1 create la-lineae-miner-db
```

شناسه‌ای که Wrangler برمی‌گرداند را در `wrangler.toml` جایگزین `REPLACE_WITH_D1_DATABASE_ID` کن.

```bash
npx wrangler d1 execute la-lineae-miner-db --local --file=./schema.sql
npx wrangler dev
```
Worker روی آدرس محلی Wrangler اجرا می‌شود. مسیر `/` رابط دمو و مسیر `/api/health` وضعیت API را برمی‌گرداند.

## انتشار اولیه
```bash
npx wrangler d1 execute la-lineae-miner-db --remote --file=./schema.sql
npx wrangler deploy
```

قبل از انتشار عمومی:
1. `BOT_TOKEN` را با `npx wrangler secret put BOT_TOKEN` تنظیم کن.
2. `ADMIN_TELEGRAM_IDS` را با شناسه عددی تلگرام ادمین در متغیرهای Worker تنظیم کن.
3. آدرس‌های دریافت وجه را تا زمان تأیید شبکه/دارایی غیرفعال نگه دار.
4. دامنه و URL نهایی Mini App را در BotFather تنظیم کن.
5. CORS را محدود به دامنه واقعی کن و Rate Limiting/WAF را فعال کن.

## نکات امنیتی مهم
- هرگز Bot Token، کلید خصوصی یا عبارت بازیابی را در کد فرانت‌اند قرار نده.
- `initDataUnsafe` فقط برای نمایش UI است؛ احراز هویت سمت سرور با `initData` خام انجام می‌شود.
- این اسکلت عمداً پرداخت را تأیید نمی‌کند. برای پرداخت واقعی باید هر شبکه و نوع توکن جداگانه بررسی شود و بعد از تأیید تراکنش روی شبکه، ادمین تصمیم نهایی را ثبت کند.
- GRAM/TON، USDT روی Tron یا شبکه‌های دیگر و SUI مسیرهای فنی متفاوت دارند. یک TxID یا آدرس به‌تنهایی برای اثبات پرداخت کافی نیست.
- نرخ ۱۰۰ مروارید = ۱ توکن و سقف ایردراپ یک میلیون، در این مرحله فقط تنظیمات پیشنهادی هستند و تعهد پرداخت محسوب نمی‌شوند.
