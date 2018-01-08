; (function () {
  Vue.component("army", {
    data() {
      return {
        time: {days: 0, hours: 0, minutes: 0, seconds: 0},
        speed: { text: '1x', value: 1 },
        speeds: [
          { text: '1x', value: 1 },
          { text: '2x', value: 2 },
          { text: '3x', value: 3 },
          { text: '4x', value: 4 },
          { text: '5x', value: 5 },
          { text: '6x fuckin dotator', value: 6 }
        ],
        mask: "##",
      }
    },
    props: ['army', "editingArmy"],
    template: `
        <div>
            <v-layout row fluid>
                <v-text-field
                label="Army Name"
                v-model="army.name"
                :rules="nameRules"
                required
                ></v-text-field>
            </v-layout>
            <v-layout row wrap>
                <v-flex md3 xs12>
                <v-text-field
                    label="Hours"
                    v-model="time.hours"
                    :mask="mask"
                    type="number"
                ></v-text-field>
                </v-flex>
                <v-flex md3 xs12>
                <v-text-field
                    label="Minutes"
                    v-model="time.minutes"
                    :rules="minutesRules"
                    :mask="mask"
                    type="number"
                ></v-text-field>
                </v-flex>
                <v-flex md3 xs12>
                <v-text-field
                    label="Seconds"
                    v-model="time.seconds"
                    :rules="secondsRules"
                    :mask="mask"
                    type="number"
                ></v-text-field>
                </v-flex>
                <v-flex md1 xs6>
                <v-select
                    v-bind:items="speeds"
                    v-model="speed"
                    label="Army speed"
                    return-object
                    single-line
                    bottom
                ></v-select>
                </v-flex>
                <v-flex md1 xs6>
                <v-text-field
                    label="Delay"
                    v-model="army.delay"
                    type="number"
                ></v-text-field>
                </v-flex>
                <v-flex md1 xs4>
                <v-btn fab dark color="indigo" @click="addArmy()"  :disabled="!validateArmy()">
                    <v-icon dark v-if="!editingArmy">add</v-icon>
                    <v-icon dark v-if="editingArmy">mdi-content-save-outline</v-icon>
                </v-btn>
                </v-flex>
            </v-layout>
        </div>
        `,
    mounted() {

    },
    watch: {
      editingArmy(newVal, oldVal) {
        if(newVal != '') {
          let newSeconds = this.army.timeToTarget;
          let newHours = Math.floor ( newSeconds / 3600 );
          let newMinutes =  Math.floor ( ( newSeconds - newHours * 3600 ) / 60 );
          newSeconds = ( newSeconds - newHours * 3600 - newMinutes * 60 );

          this.time = { days: 0, hours: newHours, minutes: newMinutes, seconds: newSeconds };

          this.speed = _.find(this.speeds, (s) => { return s.value == this.army.speedMultiplier});
        }
      }
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
    },
    methods: {
      addArmy() {
        if(this.validateArmy()) {
          this.army.timeToTarget = this.convertTime(this.time);
          this.army.speedMultiplier = this.speed.value;

          if(this.editingArmy) {
            this.$emit('army:save', this.army);
          } else {
            this.$emit('army:add', this.army);
          }
          
          this.speed = { text: '1x', value: 1 };
          this.time = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      },
      validateArmy() {
        if(!this.army.name) {
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
    }
  });
}());