

//*DUPLICATE AND RENAME
//*
//*

var csInterface = new CSInterface();

(function() {
    function duplicateAndRenameComp() {
        var script = `
            function duplicateAndRenameComp() {
                var comp = null;
                // Procurar pela composição chamada "Comp"
                for (var i = 1; i <= app.project.numItems; i++) {
                    if (app.project.item(i) instanceof CompItem && app.project.item(i).name === "Comp") {
                        comp = app.project.item(i);
                        break;
                    }
                }
                if (comp !== null) {
                    // Duplicar a composição
                    var duplicatedComp = comp.duplicate();
                    // Renomear a composição duplicada
                    duplicatedComp.name = "Composition Nova";
                    alert("Composição duplicada e renomeada com sucesso.");
                } else {
                    alert("Composição 'Comp' não encontrada.");
                }
            }
            duplicateAndRenameComp();
        `;
        csInterface.evalScript(script);
    }

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("runDupRen").addEventListener("click", duplicateAndRenameComp);
    });
})();





//*REPLACE MEDIA
//*
//*

(function() {
    function replaceMedia() {
        var script = `
    for (var i = 1; i <= app.project.numItems; i++) {
        var item = app.project.item(i);
        if (item instanceof CompItem && item.name === 'Comp') {
            var myComp = item;
            var layer = myComp.layer('avatar');
            if (layer && layer instanceof AVLayer) {
                var file = new File('B:/JORGE/alecor.png');
                if (file.exists) {
                    try {
                        var importedFile = app.project.importFile(new ImportOptions(file));
                        layer.replaceSource(importedFile, false);
                        alert('Arquivo de mídia substituído com sucesso.');
                        break; // Encerra o loop após substituir o arquivo
                    } catch (e) {
                        alert('Erro ao importar arquivo: ' + e.message);
                    }
                } else {
                    alert('Arquivo não encontrado: ' + file.fsName);
                }
            } else {
                alert('Layer "avatar" não encontrado ou não é um AVLayer');
            }
        }
    }
        `;
        csInterface.evalScript(script);
    }

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("runReplaceMedia").addEventListener("click", replaceMedia);
    });
})();




//*DUPLICATE RENAME ALL COMPS
//*
//*


(function() {

    function duplicateCompAndNestedPrecomps(compName, preCompTargetName) {
        var script = 
            "function duplicateCompAndNestedPrecomps(compName, preCompTargetName) {" +
                "function findCompByName(name) {" +
                    "for (var i = 1; i <= app.project.numItems; i++) {" +
                        "if (app.project.item(i) instanceof CompItem && app.project.item(i).name === name) {" +
                            "return app.project.item(i);" +
                        "}" +
                    "}" +
                    "return null;" +
                "}" +

                "function duplicateCompAndNestedComps(comp, targetPreCompName) {" +
                    "var preCompMap = {};" +
                    
                    "function duplicateLayer(layer) {" +
                        "if (layer.source instanceof CompItem) {" +
                            "var sourceComp = layer.source;" +
                            "if (!preCompMap[sourceComp.name]) {" +
                                "var duplicatedComp = sourceComp.duplicate();" +
                                "duplicatedComp.name = sourceComp.name + '_copy';" +
                                "preCompMap[sourceComp.name] = duplicatedComp;" +

                                "if (sourceComp.name === targetPreCompName) {" +
                                    "layer.replaceSource(duplicatedComp, false);" +
                                "}" +

                                "for (var i = 1; i <= duplicatedComp.layers.length; i++) {" +
                                    "duplicateLayer(duplicatedComp.layer(i));" +
                                "}" +
                            "}" +
                            "layer.replaceSource(preCompMap[sourceComp.name], false);" +
                        "}" +
                    "}" +

                    "var duplicatedComp = comp.duplicate();" +
                    "duplicatedComp.name = comp.name + '_copy';" +
                    "preCompMap[comp.name] = duplicatedComp;" +

                    "for (var i = 1; i <= duplicatedComp.layers.length; i++) {" +
                        "duplicateLayer(duplicatedComp.layer(i));" +
                    "}" +

                    "return duplicatedComp;" +
                "}" +

                "var mainComp = findCompByName(compName);" +
                "if (mainComp === null) {" +
                    "alert('Composição mãe não encontrada.');" +
                    "return;" +
                "}" +

                "var duplicatedMainComp = duplicateCompAndNestedComps(mainComp, preCompTargetName);" +
                "alert('Composição duplicada e renomeada com sucesso.');" +
            "}" +

            "duplicateCompAndNestedPrecomps('" + compName + "', '" + preCompTargetName + "');";
        csInterface.evalScript(script);
    }

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("runDuplicateIndependent").addEventListener("click", function() {
            var compName = prompt("Digite o nome da composição mãe:");
            var preCompTargetName = prompt("Digite o nome da precomp alvo:");
            if (compName && preCompTargetName) {
                duplicateCompAndNestedPrecomps(compName, preCompTargetName);
            } else {
                alert("Nomes inválidos fornecidos.");
            }
        });
    });
})();



//*REPLACE TEXT
//*
//*


(function() {

    function updateTextLayer(compName, layerName, newText) {
        var script = 
            "function updateTextLayer(compName, layerName, newText) {" +
                "function findCompByName(name) {" +
                    "for (var i = 1; i <= app.project.numItems; i++) {" +
                        "if (app.project.item(i) instanceof CompItem && app.project.item(i).name === name) {" +
                            "return app.project.item(i);" +
                        "}" +
                    "}" +
                    "return null;" +
                "}" +

                "var comp = findCompByName(compName);" +
                "if (comp === null) {" +
                    "alert('Composição não encontrada: ' + compName);" +
                    "return;" +
                "}" +

                "var textLayer = null;" +
                "for (var i = 1; i <= comp.numLayers; i++) {" +
                    "if (comp.layer(i).name === layerName && comp.layer(i) instanceof TextLayer) {" +
                        "textLayer = comp.layer(i);" +
                        "break;" +
                    "}" +
                "}" +

                "if (textLayer === null) {" +
                    "alert('Camada de texto não encontrada: ' + layerName);" +
                    "return;" +
                "}" +

                "textLayer.property('Source Text').setValue(newText);" +
            "}" +

            "updateTextLayer('" + compName + "', '" + layerName + "', '" + newText + "');";
        csInterface.evalScript(script);
    }

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("runTextContent").addEventListener("click", function() {
            var compName = prompt("Digite o nome da composição:");
            var layerName = prompt("Digite o nome da camada de texto:");
            var newText = prompt("Digite o novo texto:");
            if (compName && layerName && newText) {
                updateTextLayer(compName, layerName, newText);
            } else {
                alert("Todos os campos são necessários.");
            }
        });
    });
})();





//*RENDER
//*
//*

(function() {

    // Função para renderizar a composição com preset H.264
    function renderizarComposicao() {
        var script =
            "function renderComp() {" +
                // Verifica se há uma composição ativa
                "if (app.project.activeItem && app.project.activeItem instanceof CompItem) {" +
                    "var comp = app.project.activeItem;" +
                    
                    // Cria um novo objeto de renderização
                    "var renderQueue = app.project.renderQueue.items.add(comp);" +
                    
                    // Configurações de renderização
                    "var outputModule = renderQueue.outputModule(1);" +

                    // Configurações de renderização
                    "outputModule.applyTemplate('H.264');" +

                    // Define o local de salvamento do arquivo
                    "var file = new File('B:/dev/teste.mp4');" +
                    "app.beginSuppressDialogs();" +
                    "outputModule.file = file;" +
                    
                    // Inicia a renderização
                    "app.project.renderQueue.render();" +
                    "app.endSuppressDialogs(false);" +
                    
                    // Mensagem de confirmação
                    "alert('Composição enviada para a fila de renderização com sucesso.');" +
                "} else {" +
                    "alert('Nenhuma composição ativa encontrada.');" +
                "}" +
            "}" +
            "renderComp();";
        
        csInterface.evalScript(script);
    }



    // Event listener para o botão de criar composição
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("btnRenderizar").addEventListener("click", renderizarComposicao);
    });

})();












