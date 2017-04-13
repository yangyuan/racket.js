importScripts('racket.js');  
onmessage = function(e) {
    let values = Racket.execute(e.data);
    postMessage(JSON.stringify(values));
    close();
}