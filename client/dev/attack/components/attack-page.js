;(function() {
    Vue.component("attack-page", {
      data() {
        return {
          title: "Stronghold Kingdoms Attacks timing",
          attacks: [],
          attackForm: {
            attack: {
              armies: []
            }
          },
          newArmy: { name: '', timeToTarget: 0, speedMultiplier: 1 },
          orderedArmies: [],
          time: {days: 0, hours: 0, minutes: 0, seconds: 0}
        }
      },
      template: `
        
      `,
      mounted() {
        if(!$route.params.id) {
            $route.go('/');
        }
        this.get($route.params.id);
      },
      methods: {
        get() {
          this.$http.get("/api/attacks")
              .then((attacks) => {
                 return attacks.json();
              })
              .then((attacks) => {
                this.attacks = attacks;
              });
        }
      }
    });
  }());
  