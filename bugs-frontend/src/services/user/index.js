const { DEV, VITE_LOCAL } = import.meta.env
import { userService as local } from './user.service.local.js';
import { userService as remote } from './user.service.remote.js';



const service = VITE_LOCAL === 'true' ? local : remote;

export const userService = { ...service }

if (DEV) window.userService = userService

