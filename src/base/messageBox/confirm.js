import Vue from "vue";
import confirm from "./confirm.vue";
let confirmConstructor = Vue.extend(confirm);

let instance, fl;
let Confirm = options => {

    initInstance();
    document.body.appendChild(instance.$el);

 
  return new Promise((resolve, reject) => {
      console.log(fl)
       if(fl) resolve()
  });
  
};

let initInstance = function() {
  instance = new confirmConstructor({
    el: document.createElement("div")
  });

  instance.callback = defaultCallback;
};

let defaultCallback = function(flag) {
  fl = flag;
  Confirm()
};

export default Confirm;
