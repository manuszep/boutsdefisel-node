export const ROLE_USER = 'ROLE_USER';
export const ROLE_EDITOR = 'ROLE_EDITOR';
export const ROLE_COCO = 'ROLE_COCO';
export const ROLE_ADMIN = 'ROLE_ADMIN';

export const PERM_EDIT_OWN_DATA = 'PERM_EDIT_OWN_DATA';
export const PERM_ACTIVATE_USER = 'PERM_ACTIVATE_USER';

const userPermissions = [PERM_EDIT_OWN_DATA];
const editorPermissions = [...userPermissions, PERM_ACTIVATE_USER];
const cocoPermissions = [...editorPermissions];

export const hasPermission = (role:string, permission:string):boolean => {
  switch (role) {
    case ROLE_ADMIN:
      return true;
    case ROLE_COCO:
      return cocoPermissions.indexOf(permission) !== -1;
    case ROLE_EDITOR:
      return editorPermissions.indexOf(permission) !== -1;
    case ROLE_USER:
      return userPermissions.indexOf(permission) !== -1;
    default:
      return false;
  }
};
