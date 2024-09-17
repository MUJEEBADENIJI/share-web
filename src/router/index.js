import { createRouter, createWebHistory } from 'vue-router';

import PasswordManager from '../pages/PasswordManager.vue';
import GroupChat from '../pages/GroupChat.vue';
import FileSharing from '../pages/FileSharing.vue';
import PasswordList from '../pages/passwordlist.vue'; 
import suggestpassword from '../pages/suggestpassword.vue';

import GroupPage from '../pages/GroupPage.vue'; 
import ChatRoom from '../pages/ChatRoom.vue'; 


const routes = [
  { path: '/suggestbox', name: 'suggestpassword', component: suggestpassword },
  { path: '/password-list', name: 'PasswordList', component: PasswordList },
  { path: '/password-manager', name: 'PasswordManager', component: PasswordManager },
  { path: '/group-chat', name: 'GroupChat', component: GroupChat },
  { path: '/', name: 'FileSharing', component: FileSharing },


  {path: '/group', name: 'GroupPage', component: GroupPage},
  {path: '/chat-room/:groupName', name: 'ChatRoom', component: ChatRoom, props: route =>
     ({ groupName: route.params.groupName, profilePic: route.query.profilePic}),},


];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;


