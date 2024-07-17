//* COLLECT DATA LISTA
//*

function collectDataList() {
  console.log('Collecting data...');
  const allDiv = document.getElementById('all');
  const containers = Array.from(allDiv.querySelectorAll('.container-master')).sort((a, b) => {
      const idA = parseInt(a.id.replace('container-master-', ''), 10);
      const idB = parseInt(b.id.replace('container-master-', ''), 10);
      return idA - idB;
  });

  console.log('Containers sorted:', containers);

  const data = {};

  // Itera sobre cada container-master
  containers.forEach(container => {
      console.log('Processing container:', container.id);
      const containerId = container.id;
      const containerData = {
          "Comp Name": container.querySelector('.column-ID-top').textContent.trim()
      };

      // Seleciona os elementos dentro do container-master
      container.querySelectorAll('.item-group, .group').forEach(itemGroup => {
          console.log('Processing item group:', itemGroup.id);
          const groupId = itemGroup.id;

          // Seleciona os elementos dentro do item-group
          itemGroup.querySelectorAll('.action-title').forEach(actionTitle => {
              console.log('Processing action title:', actionTitle.textContent.trim());
              const actionTitleText = actionTitle.textContent.trim();
              const columnId = actionTitle.parentNode.querySelector('.column-ID').textContent.trim();
              containerData[actionTitleText] = columnId;
          });
      });

      // Adiciona os dados do container ao objeto principal
      data[containerId] = [containerData];
  });

  console.log('Data collected:', data);

  // Log the data object for debugging purposes
  console.log(data);

  // Converte o objeto data em uma string JSON
  const dataStr = JSON.stringify(data, null, 2);

  // Chama a função para organizar os dados coletados
  organizeCollectedData(data);

  // Optionally return the data for further use
  return data;
}

function organizeCollectedData(inputMap) {
  console.log('Organizing collected data...');
  let dynamicMap = [];

  let index = 1;
  for (const containerMap in inputMap) {
      inputMap[containerMap].forEach(item => {
          let newItem = {};
          for (const key in item) {
              const newKey = key.replace(/\s+/g, '') + `-${index}`;
              newItem[newKey] = item[key];
          }
          dynamicMap.push(newItem);
          index++;
      });
  }

  console.log('Dynamic map created:', dynamicMap);

  processDynamicMap(dynamicMap);
}

//* 
//*  Processar o dynamicMap
//* 

function dataConvert() {
    const csvFileInput = document.getElementById('csvFile');
    const submitButton = document.getElementById('submitButton');
    const file = csvFileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result;
      const rows = csvData.split('\n');
      const headers = rows[0].split(',');
      const columnValues = rows.map((row) => row.split(',')[0]); // assuming the first column
  
      if (headers && headers.length > 0 && columnValues.length > 0) {
        processDynamicMap(dynamicMap, columnValues, headers);
      } else {
        console.error('Error: headers or columnValues is undefined or empty');
      }
    };
    reader.readAsText(file);
  }
  
  function processDynamicMap(dynamicMap, columnValues, headers) {
    console.log('Processing dynamic map...');
    dynamicMap.forEach((item) => {
      for (var key in item) {
        var parts = key.split("-");
        var action = parts[0];
        var syntax = parts[1];
        var compNameKey = `CompName-${syntax}`;
  
        if (item.hasOwnProperty(compNameKey)) {
          var compName = item[compNameKey];
          var actionValue = item[key];
  
          // Find the column index based on the column header
          if (headers && headers.length > 0) {
            var columnIndex = headers.indexOf(parts[0]);
            if (columnIndex !== -1) {
              var cellValue = columnValues[columnIndex];
              actionValue = actionValue.replace(parts[0], cellValue);
              console.log(`Processing key: ${key}, value: ${item[key]}`);
            }
          }
          if (functionMap[action]) {
            // Passar argumentos apropriados para a função
            switch (action) {
              case "Duplicate&Rename":
                console.log('Calling duplicateAndRenameComp...');
                functionMap[action](compName, actionValue);
                break;
              case "MediaLayer":
                console.log('Calling replaceMedia...');
                var mediaPath = item[`MediaPath-${syntax}`];
                functionMap[action](compName, actionValue, mediaPath);
                break;
              case "TextLayer":
                console.log('Calling updateTextLayer...');
                var textContent = item[`TextContent-${syntax}`];
                functionMap[action](compName, actionValue, textContent);
                break;
              case "RenderPass":
                console.log('Calling renderComp...');
                if (actionValue === "TRUE") {
                  var codecPreset = item[`CodecPreset-${syntax}`];
                  var outputPath = item[`OutputPath-${syntax}`];
                  var fileName = item[`FileName-${syntax}`];
                  functionMap[action](compName, codecPreset, outputPath, fileName);
                }
                break;
              default:
                break;
            }
          }
        }
      }
    });
    console.log(`Processing key: ${key}, value: ${item[key]}`);
  }

//* 
//*  Mapeamento de funções
//* 

var functionMap = {
  "MediaLayer": replaceMedia,
  "Duplicate&Rename": duplicateAndRenameComp,
  "TextLayer": updateTextLayer,
  "RenderPass": renderComp
};

//* 
//*  Função para duplicar e renomear composições
//* 

function duplicateAndRenameComp(compName, newName) {
  console.log(`Duplicating and renaming composition...`);
  console.log(`compName: ${compName}, newName: ${newName}`); // added log
  var comp = null;
  for (var i = 1; i <= app.project.numItems; i++) {
      if (app.project.item(i) instanceof CompItem && app.project.item(i).name === compName) {
          comp = app.project.item(i);
          break;
      }
  }
  if (comp!== null) {
      var duplicatedComp = comp.duplicate();
      duplicatedComp.name = newName;
      alert("Composição duplicada e renomeada com sucesso.");
  } else {
      alert("Composição '" + compName + "' não encontrada.");
  }
}

//* 
//*  Função para substituir mídia
//* 

function replaceMedia(compName, mediaLayer, mediaPath) {
  console.log('Replacing media...');
  for (var i = 1; i <= app.project.numItems; i++) {
      var item = app.project.item(i);
      if (item instanceof CompItem && item.name === compName) {
          var myComp = item;
          var layer = myComp.layer(mediaLayer);
          if (layer && layer instanceof AVLayer) {
              var file = new File(mediaPath);
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
              alert('Layer "' + mediaLayer + '" não encontrado ou não é um AVLayer');
          }
      }
  }
}

//* 
//*  Função para atualizar a camada de texto
//* 

function updateTextLayer(compName, textLayer, textContent) {
  console.log('Updating text layer...');
  function findCompByName(name) {
      for (var i = 1; i <= app.project.numItems; i++) {
          if (app.project.item(i) instanceof CompItem && app.project.item(i).name === name) {
              return app.project.item(i);
          }
      }
      return null;
  }
  var comp = findCompByName(compName);
  if (comp === null) {
      alert('Composição não encontrada: ' + compName);
      return;
  }
  var layer = null;
  for (var i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === textLayer && comp.layer(i) instanceof TextLayer) {
          layer = comp.layer(i);
          break;
      }
  }
  if (layer === null) {
      alert('Camada de texto não encontrada: ' + textLayer);
      return;
  }
  layer.property('Source Text').setValue(textContent);
}

//* 
//*  Função para renderizar a composição
//* 

function renderComp(compName, codecPreset, outputPath, fileName) {
  console.log('Rendering composition...');
  var comp = null;
  for (var i = 1; i <= app.project.numItems; i++) {
      if (app.project.item(i) instanceof CompItem && app.project.item(i).name === compName) {
          comp = app.project.item(i);
          break;
      }
  }
  if (comp !== null) {
      var renderQueue = app.project.renderQueue.items.add(comp);
      var outputModule = renderQueue.outputModule(1);
      outputModule.applyTemplate(codecPreset);
      var file = new File(outputPath + "/" + fileName);
      app.beginSuppressDialogs();
      outputModule.file = file;
      app.project.renderQueue.render();
      app.endSuppressDialogs(false);
      alert('Composição enviada para a fila de renderização com sucesso.');
  } else {
      alert('Composição não encontrada: ' + compName);
  }
}