document.getElementById('check-values').addEventListener('click', () => {
  const result = []
  document.querySelectorAll('.action-title-top, .action-title').forEach((element) => {
    const isTop = element.classList.contains('action-title-top')
    const actionTitle = element.textContent.trim()
    let columnIdClass
    if (isTop) {
      columnIdClass = '.column-ID-top'
    } else {
      columnIdClass = '.column-ID'
    }
    const columnId = element.parentNode.querySelector(columnIdClass)
    if (columnId) {
      const columnIdText = columnId.textContent.trim()
      result.push({
        actionTitle,
        columnIdText,
      })
    }
  })
  printResults(result)
})

function printResults(result) {
  const selectedValuesDiv = document.getElementById('check-selected-values')
  let csvRowValues = ''
  result.forEach((item, index) => {
    csvRowValues += `${item.columnIdText},`
    if (index === result.length - 1) {
      csvRowValues = csvRowValues.slice(0, -1)
    }
  })
  selectedValuesDiv.textContent = `Selected Values:\n${csvRowValues}\n`
  checkCsvFile() // Chama a função para verificar o arquivo CSV após obter os valores selecionados
}

function checkCsvFile() {
  // Implementação para verificar o arquivo CSV
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const csvData = reader.result;
    handleCsvData(csvData);
  };
  reader.readAsText(file);
}

function handleCsvData(csvData) {
  // Lógica para lidar com os dados do CSV e verificar células vazias
  const csvRows = csvData.split('\n');
  const headers = csvRows[0].split(',');
  const emptyCells = [];
  csvRows.forEach((row, rowIndex) => {
    const cells = row.split(',');
    cells.forEach((cell, cellIndex) => {
      if (cell.trim() === '') {
        const columnName = String.fromCharCode(65 + cellIndex); // Convertendo o índice da coluna para a letra correspondente (A, B, C, ...)
        emptyCells.push({
          row: rowIndex + 1,
          column: columnName
        });
      }
    });
  });
  if (emptyCells.length === 0) {
    alert('Todas as células estão preenchidas no arquivo CSV.');
  } else {
    const alertMessage = emptyCells.map(emptyCell => `Linha ${emptyCell.row}, Coluna ${emptyCell.column}`).join('\n');
    alert(`Existem células vazias no arquivo CSV:\n${alertMessage}`);
  }
}



console.log('Initializing preset dropdown');
const presetDropdown = document.querySelector('.preset-list');
const presetInput = presetDropdown.querySelector('.preset-input');
const presetMenu = presetInput.querySelector('ul');
let presetItems = presetMenu.querySelectorAll('li'); // Use let for reassignment
console.log('Found', presetItems.length, 'preset items');
presetInput.addEventListener('click', (e) => {
  console.log('Preset input clicked');
  e.stopPropagation(); // Prevent click event from propagating
  presetMenu.style.display = presetMenu.style.display === 'block' ? 'none' : 'block';
});
// Use event delegation for handling item clicks
presetMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('Item clicked:', e.target.textContent);
    e.stopPropagation(); // Prevent click event from propagating
    const selectedValue = e.target.textContent.trim();
    console.log('Selected value:', selectedValue);
    presetInput.firstChild.textContent = selectedValue;
    presetMenu.style.display = 'none';
  }
});
// Filter out items with data-file-name and create new items with visible names
presetItems.forEach(item => {
  console.log('Processing item:', item.textContent);
  if (item.dataset.fileName) {
    console.log('Item has data-file-name, hiding and creating new item');
    // Hide items with data-file-name
    item.style.display = 'none';
    // Create new li with visible name
    const visibleItem = document.createElement('li');
    visibleItem.textContent = item.dataset.fileName;
    presetMenu.appendChild(visibleItem); // Add new item to menu
  }
});
console.log('Updated preset items:', presetMenu.querySelectorAll('li').length);


let presetFiles = {};

function loadFromTxt() {
  const inputField = document.getElementById('preset-input-field');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      const fileName = file.name;
      // Adiciona o preset ao objeto presetFiles
      presetFiles[fileName] = fileContent;
      // Adiciona o nome do arquivo à lista de presets
      const presetList = document.getElementById('preset-list-ul');
      const newLi = document.createElement('li');
      newLi.textContent = fileName.length > 15 ? fileName.slice(0, 15) + '...' : fileName;
      newLi.setAttribute('data-file-name', fileName);
      newLi.addEventListener('click', () => {
        // Define o preset selecionado quando o item é clicado
        document.getElementById('preset-input-field').dataset.selectedPreset = fileName;
      });
      presetList.appendChild(newLi);
    };
    reader.readAsText(file);
  });
  fileInput.click();
  document.body.removeChild(fileInput);
}

function applyPreset() {
  const inputField = document.getElementById('preset-input-field');
  const selectedPresetName = inputField.dataset.selectedPreset;
  if (selectedPresetName && presetFiles[selectedPresetName]) {
    const instructions = JSON.parse(presetFiles[selectedPresetName]);
    const allDiv = document.getElementById('all');
    allDiv.innerHTML = '';
    // Add containers and items
    Object.keys(instructions).forEach(containerId => {
      const containerData = instructions[containerId][0]; // Get container data
      console.log(`Adding container: ${containerId}`);
      addContainer(containerId);
      // Add items to container
      Object.keys(containerData).forEach(key => {
        let itemType;
        switch (key) {
          case 'Render Pass':
            itemType = 'render-pass';
            break;
          case 'Media Layer':
            itemType = 'media-layer';
            break;
          case 'Duplicate & Rename':
            itemType = 'duplicate-rename';
            break;
          case 'Text Layer':
            itemType = 'text-layer';
            break;
          default:
            itemType = null;
        }
        if (itemType) {
          console.log(`Adding item '${itemType}' to container '${containerId}'`);
          addItem(itemType, containerId);
        }
      });
    });
    // Atualizar todos os elementos column-ID fora do loop dos containers
    const columnIdElements = document.querySelectorAll('.column-ID, .column-ID-top');
    let columnIndex = 0;
    Object.keys(instructions).forEach((containerId) => {
      const containerData = instructions[containerId][0]; // Get container data
      Object.keys(containerData).forEach((key) => {
        const value = containerData[key];
        if (value !== null) {
          const element = columnIdElements[columnIndex];
          if (element) {
            console.log(`Found element at index ${columnIndex}:`);
            console.log(`Previous element: ${columnIdElements[columnIndex - 1] ? columnIdElements[columnIndex - 1].outerHTML : 'None'}`);
            console.log(`Current element: ${element.outerHTML}`);
            console.log(`Next element: ${columnIdElements[columnIndex + 1] ? columnIdElements[columnIndex + 1].outerHTML : 'None'}`);
            element.textContent = value;
            columnIndex++;
          } else {
            console.log(`No element found at index ${columnIndex} for key '${key}' with value '${value}'`);
          }
        }
      });
    });
  } else {
    alert('Selecione um preset antes de aplicar.');
  }
}






// Exemplo das funções que criam os containers e itens
function addContainer(containerId) {
  const allDiv = document.getElementById('all');
  const container = document.createElement('div');
  container.className = 'container-master';
  container.id = containerId;
  container.innerHTML = `<div class="item-group" id="item-group-${containerId}"></div>`;
  allDiv.appendChild(container);
  new Sortable(container.querySelector('.item-group'), {
    animation: 150,
    ghostClass: 'sortable-ghost'
  });
}

function addItem(type, containerId) {
  const container = document.getElementById(containerId);
  const itemGroup = container.querySelector('.item-group');
  const item = document.createElement('div');
  item.className = 'item';
  item.dataset.type = type;
  item.innerHTML = `<p>${type}</p>`;
  itemGroup.appendChild(item);
}


function handleFileSelect(event) {
  var fileInput = event.target;
  var filePathLabel = document.getElementById('filePathLabel');
  if (fileInput.value) {
    var filePath = fileInput.value;
    var maxLength = 46; // ajuste o limite de caracteres aqui
    if (filePath.length > maxLength) {
      var start = filePath.substring(0, 8);
      var end = filePath.substring(filePath.length - 38, filePath.length);
      filePath = start + ' . . . ' + end;
    }
    filePathLabel.textContent = filePath;
  } else {
    filePathLabel.textContent = "Select.csv file...";
  }
}



document.getElementById('get-selected-values').addEventListener('click', () => {
  const result = [];
  document.querySelectorAll('.action-title-top,.action-title').forEach((element) => {
    console.log(element); // Add this line
    const isTop = element.classList.contains('action-title-top');
    const actionTitle = element.textContent.trim();
    console.log(actionTitle); // Add this line
    let columnIdClass;
    if (isTop) {
      columnIdClass = '.column-ID-top';
    } else {
      columnIdClass = '.column-ID';
    }
    const columnId = element.parentNode.querySelector(columnIdClass);
    if (columnId) {
      const columnIdText = columnId.textContent.trim();
      result.push({
        actionTitle,
        columnIdText,
      });
      console.log(result); // Add this line
    }
  });
});
