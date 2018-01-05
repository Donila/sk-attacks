;(function() {
  Vue.component("attack-cmp", {
    data() {
      return {
        title: "Stronghold Kingdoms Attacks timing",
        attacks: [],
        attackForm: {
          attack: {
            armies: [],
            time: moment().format("HH:mm"),
            interval: 0
          }
        },
        attackTime: moment().format("HH:mm"),
        speed: { text: '1x', value: 1 },
        newArmy: { name: '', timeToTarget: 0, speedMultiplier: 1 },
        orderedArmies: [],
        time: {days: 0, hours: 0, minutes: 0, seconds: 0},

        speeds: [
          { text: '1x', value: 1 },
          { text: '2x', value: 2 },
          { text: '3x', value: 3 },
          { text: '4x', value: 4 },
          { text: '5x', value: 5 },
          { text: '6x fuckin dotator', value: 6 }
        ],
        mask: "##"
      }
    },
    watch: {
      speed(newVal, oldVal) {
        let seconds = moment.duration(this.time).asSeconds();

        let newSeconds = Math.floor( seconds * oldVal.value / newVal.value );

        let newHours = Math.floor ( newSeconds / 3600 );
        let newMinutes =  Math.floor ( ( newSeconds - newHours * 3600 ) / 60 );
        newSeconds = ( newSeconds - newHours * 3600 - newMinutes * 60 );

        this.time = { days: 0, hours: newHours, minutes: newMinutes, seconds: newSeconds };
      }
    },
    template: `
    <v-container>
        <v-form @submit.prevent="add(attackForm.attack)">
          <h2>Add your armies</h2>
          <v-text-field
            label="Army Name"
            v-model="newArmy.name"
            :rules="nameRules"
            required
          ></v-text-field>
          <v-layout>
            <v-flex sm3>
              <v-text-field
                label="Hours"
                v-model="time.hours"
                :mask="mask"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex sm3>
              <v-text-field
                label="Minutes"
                v-model="time.minutes"
                :rules="minutesRules"
                :mask="mask"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex sm3>
              <v-text-field
                label="Seconds"
                v-model="time.seconds"
                :rules="secondsRules"
                :mask="mask"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex sm2>
              <v-select
                v-bind:items="speeds"
                v-model="speed"
                label="Army speed"
                return-object
                single-line
                bottom
              ></v-select>
            </v-flex>
            <v-flex sm1>
              <v-btn fab dark color="indigo" @click="addArmy()" :disabled="!validateArmy()">
                <v-icon dark>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>

        <v-layout>
          <v-flex xs12 md4>
            <v-layout row>
              <v-flex md12>
                <v-time-picker v-model="attackTime" format="24hr"></v-time-picker>
              </v-flex>
            </v-layout>
            <v-flex md12>
              <v-text-field
                label="Interval between armies"
                v-model="attackForm.attack.interval"
                required
              ></v-text-field>
            </v-flex>
          </v-flex>
          <v-flex mx12 md8>
            <v-layout row>
              <v-flex xs12>
                <v-card>
                  <v-toolbar color="light-blue" dark>
                    <v-toolbar-side-icon></v-toolbar-side-icon>
                    <v-toolbar-title>Armies</v-toolbar-title>
                  </v-toolbar>
                  <v-list two-line>
                    <v-list-tile avatar v-for="army in sorted" v-bind:key="army.name" @click="">
                      <v-list-tile-avatar>
                        <v-icon x-large dark>gavel</v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ army.name }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ timeToTarget(army) }}
                          
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-list-tile-action-text>{{ fromLeader(army) }}</v-list-tile-action-text>
                        
                      </v-list-tile-action>
                      <v-list-tile-action>
                        <v-icon @click="removeArmy(army)">mdi-delete-circle</v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    `,
    mounted() {
      this.getAll();
    },
    computed: {
      nameRules() {
        return [ 
          (name) => {
            return (name && name.length > 0) || 'Please enter army name.';
          },
        ]
      },
      minutesRules() {
        return [ 
          (minutes) => {
            return (parseInt(minutes) > -1) || 'Need minutes > 0.';
          },
          (minutes) => {
            return (parseInt(minutes) < 60) || 'Need minutes < 60.';
          },
        ]
      },
      secondsRules() {
        return [ 
          (sec) => {
            return (parseInt(sec) > -1) || 'Need seconds > 0.';
          },
          (sec) => {
            return (parseInt(sec) < 60) || 'Need seconds < 60.';
          },
        ]
      },
      sorted() {
        return _.reverse(_.sortBy(this.attackForm.attack.armies, (a) => { return a.timeToTarget; }));
      },
      attackStartTime() {
        // if(this.attackTime && this.attackTime.split(':').length > 1) {
        //   let hours = this.attackTime.split(':')[0];
        //   let minutes = this.attackTime.split(':')[1];
        //   return moment().hours(hours).minutes(minutes).format("dddd, MMMM Do YYYY, H:mm:ss");
        // }
        return this.attackTime;
      }
    },
    methods: {
      getAll() {
        this.$http.get("/api/attacks")
            .then((attacks) => {
               return attacks.json();
            })
            .then((attacks) => {
              this.attacks = attacks;
            });
      },
      add(attack) {
        this.$http.post("/api/attacks", attack)
            .then((attack) => {
              return attack.json();
            })
            .then((attack) => {
              this.attacks.push(attack);
              this.newArmy = { name: '', timeToTarget: 0, speedMultiplier: 1 };
              this.attackForm = {
                attack: {
                  armies: []
                }
              };
            });
      },
      remove(id) {
        this.$http.delete("/api/attacks/" + id)
            .then(() => {
              this.todos.forEach((todo, index) => {
                if (todo._id === id) {
                  this.todos.splice(index, 1);
                }
              });
            });
      },
      addArmy() {
        this.newArmy.timeToTarget = this.convertTime(this.time);
        this.newArmy.speedMultiplier = this.speed.value;
        this.attackForm.attack.armies.push(Vue.util.extend({}, this.newArmy));

        this.newArmy = { name: '', timeToTarget: 0, speedMultiplier: 1 };
        this.speed = { text: '1x', value: 1 };
        this.time = {days: 0, hours: 0, minutes: 0, seconds: 0};
      },
      validateArmy() {
        if(!this.newArmy.name) {
          return false;
        }
        if(moment.duration(this.time).asSeconds() < 1 ) {
          return false;
        }

        return true;
      },
      convertTime(time) {
        let duration = moment.duration(time);

        return duration.asSeconds();
      },
      getSlowestArmy() {
        if(this.attackForm.attack.armies.length > 0) {
          return _.last(_.sortBy(this.attackForm.attack.armies, (a) => { return a.timeToTarget; }));
        } else {
          return { name: '' };
        }
      },
      fromLeader(army) {
        if(this.attackForm.attack.armies.length > 0) {
          let sorted = _.sortBy(this.attackForm.attack.armies, (a) => { return a.timeToTarget; });

          let slowest = _.last(sorted).name;

          let index = 1;
          for(var i = 1; i < sorted.length + 1; i++) {
            if(sorted[i - 1].name == army.name) {
              index = i;
            }
          }

          let h = 0;
          let m = 0;

          if(this.attackTime && this.attackTime.split(':').length > 1) {
            h = this.attackTime.split(':')[0];
            m = this.attackTime.split(':')[1];
          }

          let time = moment().hours(h).minutes(m).seconds(0);

          let duration = moment.duration(army.timeToTarget, 'seconds');

          if(slowest != army.name) {
            time.add(this.attackForm.attack.interval * index, 'seconds');
          }

          let timeWhen = time.subtract(duration);
          
          return timeWhen.format("H:mm:ss");
        } else {
          return "no armies";
        }
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
      },
      removeArmy(army) {
        this.attackForm.attack.armies = _.filter(this.attackForm.attack.armies, function(o) { return o.name != army.name; });
      }
    }
  });
}());
