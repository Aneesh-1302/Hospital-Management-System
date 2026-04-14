const ROLE_MAP = {
  patient: "Patient",
  doctor: "Doctor",
  admin: "Admin"
};

const normalizeRole = (role) => {
  if (typeof role !== "string") {
    return null;
  }
  return role.trim().toLowerCase();
};

module.exports = {
  normalizeRole
};
