const { Router } = require("express");
const tunnelController = require("../controllers/tunnel.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const tunnelRouter = Router();

tunnelRouter.all("/:subdomain/*", tunnelController.handleTunnelRequest);

module.exports = tunnelRouter;
