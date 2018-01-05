class AttackService {
  constructor() {
    
  }  

  getAll() {
    return Promise.resolve([]);
  }

  add(attack) {
    return Promise.resolve(attack);
  }

  remove(id) {
    return Promise.resolve(id);
  } 
}