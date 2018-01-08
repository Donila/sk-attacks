import AttackController from "../controller/attack-controller";

export default class AttackRoutes {
  static init(router) {
    router
    .route("/api/attacks")
    .get(AttackController.getAll)
    .post(AttackController.createTodo);

    router
    .route("/api/attacks/:id")
    .get(AttackController.getById)
    .put(AttackController.update)
    .delete(AttackController.deleteTodo);
  }
}
