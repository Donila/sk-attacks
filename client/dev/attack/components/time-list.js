;(function() {
    Vue.component("time-list", {
      data() {
        return {
          time: moment.now()
        }
      },
      props: ['army'],
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
        timeToTarget(army) {
          let duration = moment.duration(army.timeToTarget, 'seconds');
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