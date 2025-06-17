const { forwardToClient } = require("../services/websocket.service.js");

exports.handleTunnelRequest = async (req, res) => {
  const { subdomain } = req.params;
  const payload = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
  };
  try {
    const response = await forwardToClient(subdomain, payload);
    return res.status(200).send({ data: response });
  } catch (err) {
    return res.status(502).json({ error: err.toString() });
  }
};
