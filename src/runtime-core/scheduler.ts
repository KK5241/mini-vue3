// render更新队列
let queue: any[] = [];
let isFlushPedding = false;


// nextTick 接受一个函数，利用promise.then将函数加入到微队列当中，返回一个promise
export function nextTick(fn){
    return fn ? Promise.resolve().then(()=>{fn()}) : Promise.resolve().then() 
}
export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  queueFlush();
}

function queueFlush() {
  if (isFlushPedding) return;
  isFlushPedding = true;
  Promise.resolve().then(() => {
    let job;
    isFlushPedding = false;
    while ((job = queue.shift())) {
      job && job();
    }
  });
}
