;(function() {
    Vue.component("server-time", {
      data() {
        return {
          time: moment.now()
        }
      },
      template: `<h1>
        {{getTime()}}</h1>
      `,
      mounted() {
        this.start();
      },
      computed: {
        
      },
      methods: {
        start() {
            this.$http.get("/api/time")
            .then((time) => {
               return time.json();
            })
            .then((time) => {
                this.time = moment(time);
                setInterval(() => {
                    this.time += 1000;
                }, 1000);
            });
            
        },
        getTime() {
            return (new moment(this.time)).utc().format("H:mm:ss");
        }
      }
    });
  }());