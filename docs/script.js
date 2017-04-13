$(document).ready(function() {
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/scheme");
        editor.setOptions({
            fontFamily: 'Consolas, "Courier New", monospace',
            tabSize: 2,
            fontSize: "14px"
        });

        editor.container.style.lineHeight = "19px";
        editor.renderer.updateFontSize()
        window.editor = editor;
});


function launch() {
    $("#racket-out").empty();
    $("#racket-out").append($('<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%; height: 30px;"></div></div>'));
    
    window.racketWorker = new Worker("worker.js");
    window.racketWorker.onmessage = function(e){
        let results = JSON.parse(e.data);

        $("#racket-out").empty();
        for (let i=0; i<results.length; i++) {
            let result = results[i];
            if (result.error == null) {
                t = $('<div></div>').addClass("alert alert-success").append(result.value+"");
                $("#racket-out").append(t);
            } else {
                console.log(result.error);
                t = $('<div></div>').addClass("alert alert-danger").append(result.error +"");
                $("#racket-out").append(t);
            }
        }

        if (results.length == 0) {
            t = $('<div></div>').addClass("alert alert-warning").append("?");
            $("#racket-out").append(t);
        }
    };
    let code = window.editor.getValue();
    window.racketWorker.postMessage(code);
}


function terminate() {
    $("#racket-out").empty();
    window.racketWorker.terminate();
    window.racketWorker = undefined;
}