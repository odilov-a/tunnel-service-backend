const { Router } = require("express");
const userRoutes = require("./user.routes.js");
const adminRoutes = require("./admin.routes.js");
const tunnelRoutes = require("./tunnel.routes.js");
const router = Router();

router.use("/users", userRoutes);
router.use("/admins", adminRoutes);
router.use("/tunnels", tunnelRoutes);

module.exports = router;
