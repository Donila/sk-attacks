import TodoRoutes from "../api/todo/route/todo-route";
import AttackRoutes from "../api/attack/route/attack-route";

import StaticDispatcher from "../commons/static/index";


export default class Routes {
   static init(app, router) {
     TodoRoutes.init(router);
     AttackRoutes.init(router);

     router
      .route("/api/time")
      .get((req, res) => {
        let time = (new Date).getTime();
        return res.status(200).json(time)
      })
     
     router
       .route("*")
       .get(StaticDispatcher.sendIndex);
     

     app.use("/", router);
   }
}
