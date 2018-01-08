Vue.use(VueRouter);
Vue.use(Vuetify);

const routes = [
  { name: 'home', path: '/', component: {template: "<attack-cmp></attack-cmp>"} },
  { name: 'attack', path: '/attack/:id', component: {template: "<attack-cmp></attack-cmp>"} }
];
// { path: '/user/:id', component: User }
const router = new VueRouter({routes});

new Vue({
  router: router
}).$mount('#app');