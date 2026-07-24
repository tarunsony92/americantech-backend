const { ActivityLog } = require("../models");

// Fire-and-forget-ish audit logging: failures here must never break the request that triggered
// them, so errors are swallowed (and logged to the console) rather than propagated.
const logActivity = async ({ userId = null, actorId = null, action, description = null, req = null }) => {
  try {
    await ActivityLog.create({
      userId,
      actorId,
      action,
      description,
      ipAddress: req?.ip || null,
      userAgent: req?.headers?.["user-agent"] || null,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to write activity log:", err.message);
  }
};

module.exports = { logActivity };
