const encoder = new TextEncoder();

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
  });
}

function hex(buffer) {
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function parseQuery(queryString) {
  const params = new URLSearchParams(queryString);
  const entries = [];
  for (const [key, value] of params.entries()) entries.push([key, value]);
  return entries;
}

// Telegram Mini Apps server-side initData verification.
// BOT_TOKEN must be configured as a Worker secret before auth is enabled.
async function verifyTelegramInitData(initData, botToken, maxAgeSeconds = 86400) {
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  const authDate = Number(params.get("auth_date"));
  if (!receivedHash || !Number.isFinite(authDate)) return null;
  if (Math.abs(Math.floor(Date.now() / 1000) - authDate) > maxAgeSeconds) return null;

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = await crypto.subtle.importKey(
    "raw", encoder.encode("WebAppData"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const secret = await crypto.subtle.sign("HMAC", secretKey, encoder.encode(botToken));
  const signingKey = await crypto.subtle.importKey(
    "raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const expectedHash = hex(await crypto.subtle.sign("HMAC", signingKey, encoder.encode(dataCheckString)));
  if (expectedHash.length !== receivedHash.length) return null;
  let diff = 0;
  for (let i = 0; i < expectedHash.length; i++) diff |= expectedHash.charCodeAt(i) ^ receivedHash.toLowerCase().charCodeAt(i);
  if (diff !== 0) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;
  try {
    const user = JSON.parse(userRaw);
    if (!user || !Number.isSafeInteger(Number(user.id))) return null;
    return { id: String(user.id), username: user.username || null, first_name: user.first_name || null };
  } catch {
    return null;
  }
}

async function getUser(request, env) {
  const initData = request.headers.get("x-telegram-init-data") || "";
  const user = await verifyTelegramInitData(initData, env.BOT_TOKEN);
  return user;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "la-lineae-miner", phase: 1, paymentsEnabled: false });
    }

    if (url.pathname === "/api/config" && request.method === "GET") {
      return json({
        appName: "La Lineae Miner",
        tickerSymbols: ["BTC", "SUI", "GRAM"],
        pearlsPerToken: 100,
        dailyActivityPoints: 50,
        purchasePointsPerUsd: 1,
        proposedAirdropCap: 1000000,
        listingDateType: "target_unconfirmed",
        paymentsEnabled: false
      });
    }

    if (url.pathname === "/api/me" && request.method === "GET") {
      const user = await getUser(request, env);
      if (!user) return json({ error: "telegram_auth_required" }, 401);
      if (!env.DB) return json({ error: "database_not_configured" }, 503);
      await env.DB.prepare(
        `INSERT INTO users (telegram_id, username, first_name)
         VALUES (?, ?, ?)
         ON CONFLICT(telegram_id) DO UPDATE SET
           username=excluded.username,
           first_name=excluded.first_name,
           updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')`
      ).bind(user.id, user.username, user.first_name).run();
      const row = await env.DB.prepare(
        `SELECT telegram_id, username, first_name, pearls, activity_points, purchase_points
         FROM users WHERE telegram_id = ?`
      ).bind(user.id).first();
      return json({ user: row });
    }

    // Admin and payment endpoints are intentionally not enabled in phase 1.
    if (url.pathname.startsWith("/api/admin") || url.pathname.startsWith("/api/payments")) {
      return json({ error: "not_enabled_until_networks_and_admin_auth_are_configured" }, 501);
    }

    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, 404);

    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("La Lineae Miner phase 1", { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
};
