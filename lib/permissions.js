export const ROLE_PERMISSIONS = {
  'Software Developer': { dashboard:true, export_view:true, export_add:true, client_view:true, client_add:true, note_view:true, note_add:true, users_view:true, users_add:true, settings_view:true },
  'CEO Mongolia': { dashboard:true, export_view:true, export_add:true, client_view:true, client_add:true, note_view:true, note_add:true, users_view:true, users_add:true, settings_view:true },
  'CEO Thailand': { dashboard:true, export_view:true, export_add:true, client_view:false, client_add:false, note_view:true, note_add:true, users_view:false, users_add:false, settings_view:false },
  'Admin': { dashboard:true, export_view:true, export_add:true, client_view:true, client_add:true, note_view:true, note_add:true, users_view:true, users_add:true, settings_view:true },
  'Customer Service Officer': { dashboard:false, export_view:true, export_add:false, client_view:true, client_add:true, note_view:true, note_add:false, users_view:false, users_add:false, settings_view:false },
  'Origin Officer': { dashboard:false, export_view:true, export_add:true, client_view:false, client_add:false, note_view:true, note_add:false, users_view:false, users_add:false, settings_view:false },
  'Staff': { dashboard:true, export_view:true, export_add:true, client_view:true, client_add:true, note_view:true, note_add:true, users_view:false, users_add:false, settings_view:false },
};

export function hasPermission(role, perm) {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms[perm] === true;
}
