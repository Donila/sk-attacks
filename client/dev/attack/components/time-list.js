;(function() {
    Vue.component("time-list", {
      data() {
        return {
          time: moment.now()
        }
      },
      props: ['army', 'x'],
      template: `
        <div>{{ timeToTarget(army) }}</div>
      `,
      mounted() {
        this.start();
      },
      computed: {
        
      },
      methods: {
        start() {
            
        },
        timeToTarget() {
          let duration = moment.duration(this.army.timeToTarget * this.army.speedMultiplier / this.x, 'seconds');
            return this.formatTime(duration.hours()) + ":" + this.formatTime(duration.minutes()) + ":" + this.formatTime(duration.seconds());
        },
        formatTime(t) {
            if((t + '').length < 2) {
              return "0" + t;
            } else {
              return t;
            }
          }
      }
    });
  }());