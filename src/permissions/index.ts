type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  admin: ["monitor:everything"],
  vendor: ["provider:resources"],
  user: [],
} as const;

export default function hasPermission(
  user: { role: string },
  requiredPermission: Permission,
) {
  const userRole = user.role.toLowerCase() as Role;
  return (ROLES[userRole] as readonly Permission[]).includes(
    requiredPermission,
  );
}
