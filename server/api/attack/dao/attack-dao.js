import mongoose from "mongoose";
import Promise from "bluebird";
import attackSchema from "../model/attack-model";
import _ from "lodash";

attackSchema.statics.getAll = () => {
  return new Promise((resolve, reject) => {
    var _query = {};

    Attack.find(_query)
        .exec((err, todos) => {
          err ? reject(err)
              : resolve(todos);
        });
  });
}

attackSchema.statics.getById = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
          return reject(new TypeError("Id is not defined."));
        }

        Attack.findById(id)
            .exec((err, todo) => {
              err ? reject(err)
                  : resolve(todo);
            });
    });
}

attackSchema.statics.createTodo = (todo) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(todo)) {
      return reject(new TypeError("Todo is not a valid object."));
    }

    var _todo = new Attack(todo);

    _todo.save((err, saved) => {
      err ? reject(err)
      : resolve(saved);
    });
  });
}

attackSchema.statics.deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(id)) {
      return reject(new TypeError("Id is not a valid string."));
    }

    Attack.findByIdAndRemove(id)
        .exec((err, deleted) => {
          err ? reject(err)
              : resolve();
        });
  });
}

var Attack = mongoose.model("Attack", attackSchema);

export default Attack;
