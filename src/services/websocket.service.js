const WebSocket = require("ws");
const { verify } = require("../utils/jwt");
const tunnels = new Map();
const pendingResponses = new Map();

function initWebSocket(server) {
  const wss = new WebSocket.Server({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws) => {
    let subdomain = null;

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        if (data.type === "register") {
          const { subdomain: sub, token } = data;

          if (!token) {
            ws.send(JSON.stringify({ type: "error", message: "Token not found" }));
            ws.close();
            return;
          }

          let decoded;
          try {
            decoded = verify(token);
          } catch (err) {
            ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
            ws.close();
            return;
          }

          if (!["user"].includes(decoded.role)) {
            ws.send(JSON.stringify({ type: "error", message: "Forbidden role" }));
            ws.close();
            return;
          }

          subdomain = sub;
          tunnels.set(subdomain, ws);

          console.log(`[+] Registered: ${subdomain} by user ${decoded.username || decoded.id}`);
          ws.send(JSON.stringify({ type: "registered", subdomain }));
        }

        if (data.type === "response" && data.requestId) {
          const cb = pendingResponses.get(data.requestId);
          if (cb) {
            cb(data.payload);
            pendingResponses.delete(data.requestId);
          }
        }

      } catch (err) {
        console.error("WS error:", err.message);
        ws.send(JSON.stringify({ type: "error", message: "Internal server error" }));
        ws.close();
      }
    });

    ws.on("close", () => {
      if (subdomain) {
        tunnels.delete(subdomain);
        console.log(`[-] Disconnected: ${subdomain}`);
      }
    });
  });
}

function forwardToClient(subdomain, payload) {
  return new Promise((resolve, reject) => {
    const ws = tunnels.get(subdomain);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return reject("Client offline");
    }

    const requestId = Date.now() + Math.random().toString(36).slice(2);
    pendingResponses.set(requestId, resolve);

    ws.send(
      JSON.stringify({
        type: "request",
        requestId,
        payload,
      })
    );

    setTimeout(() => {
      if (pendingResponses.has(requestId)) {
        pendingResponses.delete(requestId);
        reject("Client timeout");
      }
    }, 10000);
  });
}

module.exports = { initWebSocket, forwardToClient };
