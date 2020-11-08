export default class Utils {
  static debounce = (fn, debounceTime) => {
    //code here
    let lastCalledTime = null;
    let timerId = null;
  
    return function() {
      let currentTime = Date.now();
      if(lastCalledTime != null && (currentTime - lastCalledTime) < debounceTime) {
        clearTimeout(timerId)
      }
  
      timerId = setTimeout(() => {
        fn.apply(this, arguments);
      }, debounceTime);
      
      lastCalledTime = Date.now();
    }
  };
}