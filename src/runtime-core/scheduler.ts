// render更新队列
let queue: any[] = [];
let isFlushPedding = false;


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
