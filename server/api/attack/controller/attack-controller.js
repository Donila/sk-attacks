import AttackDAO from "../dao/attack-dao";

export default class AttackController {
  static getAll(req, res) {
    AttackDAO
      .getAll()
      .then(todos => res.status(200).json(todos))
      .catch(error => res.status(400).json(error));
  }

  static getById(req, res) {
      AttackDAO
        .getById(req.params.id)
        .then(todo => res.status(200).json(todo))
        .catch(error => res.status(400).json(error));
  }

  static update(req, res) {
    AttackDAO
      .update({ _id: req.params.id }, { $set: req.body})
      .then((todo) => {
        return res.status(200).json(todo);
      })
      .catch((error) => {
        return res.status(400).json(error);
      });
}

  static createTodo(req, res) {
    let _todo = req.body;

    AttackDAO
      .createTodo(_todo)
      .then(todo => res.status(201).json(todo))
      .catch(error => res.status(400).json(error));
  }

  static deleteTodo(req, res) {
    let _id = req.params.id;

    AttackDAO
      .deleteTodo(_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }
}
