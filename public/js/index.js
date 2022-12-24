let code = document.getElementById("editor");
    
let editor = CodeMirror.fromTextArea(code,{
    mode : "text/x-csrc",
     theme: "neo",
    lineNumbers: true,
    autoCloseBrackets : true,
});

let width = window.innerWidth;
editor.setSize(0.50*width,405);




