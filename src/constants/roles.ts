export const Roles = {
  MAIN_ADMIN: 'MainAdmin',
  SHARAN_STAFF: 'SharanStaff',
  SAFAL_ADMIN: 'SafalAdmin'
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
export default Roles;