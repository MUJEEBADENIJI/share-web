import { createRouter, createWebHistory } from 'vue-router';

import PasswordManager from '../pages/PasswordManager.vue';
import GroupChat from '../pages/GroupChat.vue';
import FileSharing from '../pages/FileSharing.vue';

const routes = [
 
  { path: '/password-manager', name: 'PasswordManager', component: PasswordManager },
  { path: '/group-chat', name: 'GroupChat', component: GroupChat },
  { path: '/', name: 'FileSharing', component: FileSharing },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
