(function() {
    var csInterface = new CSInterface();

    function createNewComposition() {
        var script = 
            "function createComp() {" +
                "var compName = 'New Comp';" +
                "var compWidth = 1920;" +
                "var compHeight = 1080;" +
                "var compPixelAspect = 1.0;" +
                "var compDuration = 10;" +
                "var compFrameRate = 24;" +
                "var newComp = app.project.items.addComp(compName, compWidth, compHeight, compPixelAspect, compDuration, compFrameRate);" +
                "alert('Composição criada: ' + newComp.name);" +
            "}" +
            "createComp();";
        csInterface.evalScript(script);
    }

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("runNewComp").addEventListener("click", createNewComposition);
    });
})();


