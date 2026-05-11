const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return emailRegex.test(String(email || "").trim().toLowerCase());
}

function hasRequiredFields(body, fields) {
  return fields.every((field) => String(body[field] || "").trim());
}

module.exports = { isValidEmail, hasRequiredFields };
