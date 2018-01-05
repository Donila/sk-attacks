"use strict";;(function(){Vue.component("server-time",{data:function data(){return{time:moment.now()}},template:"<h1>\n        Using time from server: <b>{{getTime()}}</b></h1>\n      ",mounted:function mounted(){this.start()},computed:{},methods:{start:function start(){var _this=this;this.$http.get("/api/time").then(function(a){return a.json()}).then(function(a){_this.time=moment(a),setInterval(function(){_this.time+=1000},1000)})},getTime:function getTime(){return new moment(this.time).format("dddd, MMMM Do YYYY, H:mm:ss")}}})})();