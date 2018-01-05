Vue.use(VueRouter);
Vue.use(Vuetify);

const routes = [
  { path: '/', component: {template: "<attack-cmp></attack-cmp>"} },
  { path: '/attack/:id', component: {template: "<attack-page></attack-page>"} }
];
// { path: '/user/:id', component: User }
const router = new VueRouter({routes});

new Vue({
  router: router
}).$mount('#app');