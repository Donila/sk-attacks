;(function() {
    Vue.component("server-time", {
      data() {
        return {
          time: moment.now()
        }
      },
      template: `<h1>
        Using time from server: <b>{{getTime()}}</b></h1>
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
            return (new moment(this.time)).format("dddd, MMMM Do YYYY, H:mm:ss");
        }
      }
    });
  }());