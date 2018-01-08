; (function () {
  Vue.component("attack-cmp", {
    data() {
      return {
        title: "Stronghold Kingdoms Attacks timing",
        attacks: [],
        attackForm: {
          attack: {
            armies: [],
            time: moment().utc().format("HH:mm"),
            village: ''
          }
        },
        attackTime: moment().utc().format("HH:mm"),

        army: { name: '', timeToTarget: 0, speedMultiplier: 1, delay: 0 },
        orderedArmies: [],
        time: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        editingArmy: '',

        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Delay', value: 'delay' },
          { text: 'Time', sortable: false },
          { text: '1x', sortable: false },
          { text: '2x', sortable: false },
          { text: '3x', sortable: false },
          { text: '4x', sortable: false },
          { text: '5x', sortable: false },
          { text: '6x', sortable: false }
        ],
        snackBarText: 'UPDATED!',
        snackbar: false
      }
    },
    template: `
    <div>
    <v-form @submit.prevent="add(attackForm.attack)">
      <v-layout row fluid>
        <v-flex xs12>
          <v-text-field
          label="Village"
          v-model="attackForm.attack.village"
          :rules="nameRules"
          required
          ></v-text-field>
        </v-flex>
      </v-layout>

        <v-layout row wrap>
          <v-flex xs12 md3>
            <v-layout row>
              <v-flex xs12>
                <v-time-picker v-model="attackTime" format="24hr"></v-time-picker>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 md9>
            <v-layout row wrap>
              <v-flex xs12>
                  <h2 v-if="!editingArmy">Add new army</h2>
                  <h2 v-if="editingArmy">Editing {{editingArmy}}</h2>
                  <army :army="army" @army:add="addArmy()" @army:save="saveArmy() "v-bind:class="{ 'indigo lighten-3': editingArmy }" :editingArmy="editingArmy"></army>
                
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout row flat>
          <v-flex xs12>
          <h2>Armies</h2>
            <v-data-table
                v-bind:headers="headers"
                :items="attackForm.attack.armies"
                hide-actions
                class="elevation-1"
              >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{ 'indigo lighten-3': props.item.name == editingArmy }">
                  <td>{{ props.item.name }}</td>
                  <td>
                    {{props.item.delay}}s ({{timeWithDelay(props.item)}})
                  </td>
                  <td class="text-xs-right">
                    {{timeWhen(props.item)}}
                  </td>
                  <td class="text-xs-right" v-for="i in 6" v-bind:class="{  'indigo darken-4': props.item.speedMultiplier == i }"><a v-if="!editingArmy" @click="changeToX(props.item, i)"><time-list :army="props.item" :x="i"></time-list></a> <span v-if="editingArmy"><time-list :army="props.item" :x="i"></time-list></span></td>
                  <td>
                    <v-icon @click="editArmy(props.item)">mdi-pencil-circle</v-icon>
                    <v-icon @click="removeArmy(props.item)">mdi-delete-circle</v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
          <v-btn color="indigo" large dark type="submit" :disabled="!validateAttack()">
          <span v-if="!$route.params.id">SHARE THIS ATTACK</span>
          <span v-if="$route.params.id">UPDATE</span>
          </v-btn>
          <v-snackbar
            :timeout="6000"
            :top="false"
            :bottom="true"
            :right="false"
            :left="false"
            :multi-line="false"
            :vertical="false"
            v-model="snackbar"
          >
            {{ snackBarText }}
            <v-btn flat color="indigo" @click.native="snackbar = false">Close</v-btn>
          </v-snackbar>
          <v-spacer></v-spacer>
          <router-link to="/" v-if="$route.params.id">
            <v-btn color="indigo" large dark>
              Create new attack
            </v-btn>
          </router-link>
          
        </v-form>
      </div>
    `,
    mounted() {
      this.getAll();
    },
    computed: {
      attackStartTime() {
        // if(this.attackTime && this.attackTime.split(':').length > 1) {
        //   let hours = this.attackTime.split(':')[0];
        //   let minutes = this.attackTime.split(':')[1];
        //   return moment().hours(hours).minutes(minutes).format("dddd, MMMM Do YYYY, H:mm:ss");
        // }
        return this.attackTime;
      },
      nameRules() {
        return [
          (name) => {
            return (name && name.length > 0) || 'Please enter vilage name.';
          },
        ]
      },
    },
    methods: {
      getAll() {
        if(this.$route.params.id) {
          this.$http.get("/api/attacks/" + this.$route.params.id)
            .then((attack) => {
            return attack.json();
          }, (err) => {
            this.$router.push('/');
          })
          .then((attack) => {
            if(attack && attack._id) {
              this.attackForm.attack = attack;
              this.attackTime = moment(this.attackForm.attack.time).utc().format("HH:mm");
            }
          });
        }
        // this.$http.get("/api/attacks")
        //   .then((attacks) => {
        //     return attacks.json();
        //   })
        //   .then((attacks) => {
        //     this.attacks = attacks;
        //   });
      },
      add(attack) {
        if(this.validateAttack()) {
          let h = 0;
          let m = 0;
          if (this.attackTime && this.attackTime.split(':').length > 1) {
            h = this.attackTime.split(':')[0];
            m = this.attackTime.split(':')[1];
          }

          let time = moment().utc().hours(h).minutes(m).seconds(0).millisecond(0);

          attack.time = time.toDate();

          if(this.$route.params.id) {
            this.$http.put("/api/attacks/" + this.$route.params.id, attack)
            .then((attack) => {
              return attack.json();
            })
            .then((attack) => {
              this.snackbar = true;
            });
          } else {
            this.$http.post("/api/attacks", attack)
            .then((attack) => {
              return attack.json();
            })
            .then((attack) => {
              this.$router.push({ name: 'attack', params: { id: attack._id }});
            });
          }
        }
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
        if(this.validateArmy()) {
          this.attackForm.attack.armies.push(Vue.util.extend({}, this.army));

          this.army = { name: '', timeToTarget: 0, speedMultiplier: 1, delay: this.attackForm.attack.armies.length };
        }
      },
      editArmy(army) {
        if(this.editingArmy == this.army.name && this.army.name != '') {
          this.saveArmy();
        } else {
          this.army = army;
          this.editingArmy = army.name;
        }
        
      },
      saveArmy() {
        this.editingArmy = '';
        this.army = { name: '', timeToTarget: 0, speedMultiplier: 1, delay: this.attackForm.attack.armies.length }
      },
      validateArmy() {
        let existedArmy = _.filter(this.attackForm.attack.armies, (a) => { return a.name == this.army.name });

        if (existedArmy.length > 0) {
          return false;
        }

        return true;
      },
      validateAttack() {
        if(!this.attackForm.attack.village) {
          return false;
        }
        if(this.attackForm.attack.armies.length < 1) {
          return false;
        }

        return true;
      },
      getSlowestArmy() {
        if (this.attackForm.attack.armies.length > 0) {
          return _.last(_.sortBy(this.attackForm.attack.armies, (a) => { return a.timeToTarget; }));
        } else {
          return { name: '' };
        }
      },
      timeWhen(army, x) {
        if (!x) {
          x = army.speedMultiplier;
        }
        if (this.attackForm.attack.armies.length > 0) {
          let sorted = _.sortBy(this.attackForm.attack.armies, (a) => { return a.timeToTarget; });

          let slowest = _.last(sorted).name;

          let index = 1;
          for (var i = 1; i < sorted.length + 1; i++) {
            if (sorted[i - 1].name == army.name) {
              index = i;
            }
          }

          let h = 0;
          let m = 0;

          if (this.attackTime && this.attackTime.split(':').length > 1) {
            h = this.attackTime.split(':')[0];
            m = this.attackTime.split(':')[1];
          }

          let delay = 0;
          try {
            delay = parseInt(army.delay);
          } catch (e) {
            console.log(e);
            console.log("Entered delay is unsupported.");
          }

          let duration = moment.duration(army.timeToTarget * army.speedMultiplier / x, 'seconds');

          let time = moment().utc().hours(h).minutes(m).seconds(0).milliseconds(0);

          let timeWhen = time.add(delay, 'seconds').subtract(duration);

          return timeWhen.format("H:mm:ss");
        } else {
          return "no armies";
        }
      },
      timeWithDelay(army) {
        let h = 0;
        let m = 0;

        if (this.attackTime && this.attackTime.split(':').length > 1) {
          h = this.attackTime.split(':')[0];
          m = this.attackTime.split(':')[1];
        }
        let delay = 0;
        try {
          delay = parseInt(army.delay);
        } catch (e) {
          console.log(e);
          console.log("Entered delay is unsupported.");
        }

        let time = moment().utc().hours(h).minutes(m).seconds(0).milliseconds(0);

        return time.add(delay, 'seconds').format("H:mm:ss");
      },
      timeToTarget(army) {
        let duration = moment.duration(army.timeToTarget, 'seconds');
        return this.formatTime(duration.hours()) + ":" + this.formatTime(duration.minutes()) + ":" + this.formatTime(duration.seconds());
      },
      formatTime(t) {
        if ((t + '').length < 2) {
          return "0" + t;
        } else {
          return t;
        }
      },
      removeArmy(army) {
        this.attackForm.attack.armies = _.filter(this.attackForm.attack.armies, function (o) { return o.name != army.name; });
      },
      get1xTime(seconds) {
        let newSeconds = Math.floor(seconds * oldVal.value / newVal.value);

        let newHours = Math.floor(newSeconds / 3600);
        let newMinutes = Math.floor((newSeconds - newHours * 3600) / 60);
        newSeconds = (newSeconds - newHours * 3600 - newMinutes * 60);

        return { days: 0, hours: newHours, minutes: newMinutes, seconds: newSeconds };
      },
      changeToX(army, x) {
        var realArmy = _.filter(this.attackForm.attack.armies, function (o) { return o.name == army.name; })[0];

        realArmy.timeToTarget = army.timeToTarget * army.speedMultiplier / x;
        army.speedMultiplier = x;
      }
    }
  });
}());
