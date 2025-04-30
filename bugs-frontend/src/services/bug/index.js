const { DEV, VITE_LOCAL } = import.meta.env
import { bugService as local } from './bug.service.local.js';
import { bugService as remote } from './bug.service.remote.js';



const service = VITE_LOCAL === 'true' ? local : remote;

export const bugService = { ...service }

if (DEV) window.bugService = bugService

