function toggleDropdown(element) {
    var dropdownContent = element.parentNode.querySelector('.dropdown-content');
    var isVisible = dropdownContent.classList.contains("show");
    closeAllDropdowns();
    if (!isVisible) {
      dropdownContent.classList.toggle("show");
    }
  }
  // Função para fechar todos os dropdowns
  function closeAllDropdowns() {
    var dropdowns = document.querySelectorAll(".dropdown-content, .dropdown-add-action");
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('show');
    }
  }
  // Função para truncar texto se ele for maior que o tamanho máximo
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  }
  const idSet = new Set();
  //Função global para gerar IDs únicos
  function generateUniqueId(prefix = 'id') {
    let id;
    do {
      id = `${prefix}-${Math.floor(Math.random() * 1000000000)}`;
    } while (idSet.has(id));
    idSet.add(id);
    return id;
  }
  // Função para atualizar a classe .selected em todos os dropdowns
  function updateSelectedClasses() {
    var allDropdownItems = document.querySelectorAll('.dropdown-content-csvlist');
    allDropdownItems.forEach(item => {
      var itemText = item.children[0].textContent;
      var itemNumber = item.children[1].textContent;
      // Verificar se este item foi selecionado em algum dropdown
      var isSelected = Object.values(selectedItems).some(selected => {
        return selected.text === itemText && selected.number === itemNumber;
      });
      // Adicionar ou remover a classe .selected conforme a seleção
      if (isSelected) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }
  // Objeto para armazenar as seleções feitas em cada dropdown
  var selectedItems = {};
  // Função para inicializar os dropdowns existentes e futuros
  function initializeDropdowns() {
    // Selecionar todos os dropdowns existentes e futuros
    var allDropdowns = document.querySelectorAll('.dropdown-content');
    // Iterar sobre cada dropdown para adicionar o evento de seleção
    allDropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', function(event) {
        var target = event.target.closest('.dropdown-content-csvlist');
        if (target) {
          selectColumn(target);
        }
      });
    });
  }
  // Função para selecionar uma coluna
  function selectColumn(element) {
    var maxLength = 20; // Número máximo de caracteres
    var columnText = element.children[0].textContent;
    var columnNumber = element.children[1].textContent;
    var truncatedColumnText = truncateText(columnText, maxLength);
    // Encontrar o dropdown específico onde o item foi selecionado
    var dropdown = element.closest('.dropdown-content');
    var dropdownId = dropdown.id;
    // Armazenar a escolha feita para este dropdown específico
    selectedItems[dropdownId] = {
      text: columnText,
      number: columnNumber
    };
    // Atualizar a classe .selected em todos os itens deste dropdown específico
    // Atualizar a classe .selected em todos os itens deste dropdown específico
    var dropdownItems = dropdown.querySelectorAll('.dropdown-content-csvlist');
    dropdownItems.forEach(item => {
      var itemText = item.children[0].textContent;
      var itemNumber = item.children[1].textContent;
      if (itemText === columnText && itemNumber === columnNumber) {
        item.classList.add('selected');
        item.classList.add('another-class'); // Adiciona uma segunda classe
      } else {
        item.classList.remove('selected');
        item.classList.remove('another-class'); // Remove a segunda classe se não for selecionado
      }
    });
    /*
    var dropdownItems = dropdown.querySelectorAll('.dropdown-content-csvlist');
    dropdownItems.forEach(item => {
      var itemText = item.children[0].textContent;
      var itemNumber = item.children[1].textContent;
      if (itemText === columnText && itemNumber === columnNumber) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
    */
    // Atualizar todas as divs .dropdown-content-csvlist com a classe .selected conforme as seleções feitas
    updateSelectedClasses();
    // Verifica se o elemento pai mais próximo é um grupo
    var closestItem = element.closest('.item') || element.closest('.item-group') || element.closest('.item-top');
    if (closestItem) {
      var selectColumnBar = closestItem.querySelector(".select-column-bar") || closestItem.querySelector(".select-column-bar-top");
      var columnIdElement = closestItem.querySelector(".column-ID") || closestItem.querySelector(".column-ID-top");
      if (selectColumnBar && columnIdElement) {
        selectColumnBar.firstChild.textContent = truncatedColumnText + ' ';
        columnIdElement.textContent = columnNumber; // atualiza com a letra do segundo span
      }
    }
    // Trunca texto dos dropdowns
    var dropdownElements = document.querySelectorAll('.dropdown-content-csvlist span:first-child');
    dropdownElements.forEach(element => {
      element.textContent = truncateText(element.textContent, maxLength);
    });
    closeAllDropdowns();
  }
  // Função para atualizar todos os dropdowns com os dados CSV
  function updateAllDropdownsFromCSV() {
    const dropdownContents = document.querySelectorAll('.dropdown-content');
    dropdownContents.forEach(dropdownContent => {
      dropdownContent.innerHTML = ''; // Limpa o conteúdo do container
      csvDataGlobal.forEach((cell, index) => {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'dropdown-content-csvlist'; // Cria um novo div com a classe "dropdown-item-csv"
        outputDiv.setAttribute('onclick', 'selectColumn(this)'); // Adiciona o evento onclick
        const cellText = document.createElement('span');
        cellText.textContent = cell;
        const columnLetter = document.createElement('span');
        columnLetter.textContent = String.fromCharCode(64 + index + 1); // A=1, B=2,...
        outputDiv.appendChild(cellText);
        outputDiv.appendChild(columnLetter);
        dropdownContent.appendChild(outputDiv); // Adiciona o novo div ao container
      });
    });
    updateSelectedClasses(); // Atualiza a classe .selected dos dropdowns
  }
  // Inicializar os dropdowns existentes e futuros
  initializeDropdowns();
  // Função para fechar o dropdown se clicar fora dele
  // Também para deixar clicável
  window.onclick = function(event) {
    if (!event.target.matches('.select-column-bar, .open-dropdown') && !event.target.matches('.select-column-bar-top, .open-dropdown') && !event.target.matches('.add-item-btn, .icon-add-action') && !event.target.closest('.dropdown-content') && !event.target.closest('.dropdown-add-action')) {
      closeAllDropdowns();
    }
  }
  // Função para alternar visibilidade do dropdown para adicionar novo item
  function toggleAddItemDropdown(dropdownId, containerId) {
    var dropdownElement = document.getElementById(dropdownId);
    var addItemBtn = document.getElementById(`add-item-btn-${containerId}`); // Botão específico do container clicado
    // Verifica se o dropdown e o botão foram encontrados
    if (dropdownElement && addItemBtn) {
      var isVisible = dropdownElement.classList.contains("show");
      closeAllDropdowns();
      if (!isVisible) {
        // Ajusta a posição do dropdown com base na posição do botão dentro do container
        var rect = addItemBtn.getBoundingClientRect();
        dropdownElement.style.top = rect.bottom + window.scrollY + 'px';
        dropdownElement.style.left = rect.left + window.scrollX + 'px';
        dropdownElement.classList.toggle("show");
      }
    }
  }
  // Função para adicionar novo item
  let csvDataGlobal = [];
  document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csvFile');
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result;
        const rows = csvData.split('\n');
        csvDataGlobal = rows[0].split(','); // Armazenar a primeira linha (cabeçalho) globalmente
        updateAllDropdownsFromCSV(); // Atualizar todos os dropdowns
      };
      reader.readAsText(file);
    });
    // Função para atualizar todos os dropdowns com os dados CSV
    const updateDropdowns = () => {
      const dropdownContents = document.querySelectorAll('.dropdown-content');
      dropdownContents.forEach(dropdownContent => {
        dropdownContent.innerHTML = ''; // Limpa o conteúdo do container
        csvDataGlobal.forEach((cell, index) => {
          const outputDiv = document.createElement('div');
          outputDiv.className = 'dropdown-content-csvlist'; // Cria um novo div com a classe "dropdown-item-csv"
          outputDiv.setAttribute('onclick', 'selectColumn(this)'); // Adiciona o evento onclick
          const cellText = document.createElement('span');
          cellText.textContent = cell;
          const columnLetter = document.createElement('span');
          columnLetter.textContent = String.fromCharCode(64 + index + 1); // A=1, B=2,...
          outputDiv.appendChild(cellText);
          outputDiv.appendChild(columnLetter);
          dropdownContent.appendChild(outputDiv); // Adiciona o novo div ao container
        });
      });
    };
    // Observa mudanças no DOM para adicionar novos dropdowns
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && (node.matches('.container-master') || node.matches('.item'))) {
            updateAllDropdownsFromCSV(); // Atualizar todos os dropdowns
          }
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
  // Função para adicionar novo container
  function getAvailableId() {
    let id = 1;
    while (document.getElementById(`container-master-${id}`)) {
      id++;
    }
    return `container-master-${id}`;
  }

  function addContainer() {
    const allContainer = document.getElementById('all');
    const newContainer = document.createElement("div");
    newContainer.className = "container-master"; // Note the change to "container-master-ID"
    newContainer.id = getAvailableId(); // Use the available ID
    const containerItemId = `container-item-${newContainer.id}`;
    const addItemBtnId = `add-item-btn-${newContainer.id}`;
    const dropdownId = `dropdown-add-item-${newContainer.id}`;
    newContainer.innerHTML = `


                                      
                                                  <!--<div class="spacer-master"></div>-->
                                                  <div class="item-top" id="${generateUniqueId('comp-name')}">
                                                      <div class="content-bar-top">
                                                          <div class="action-title-top">Comp Name</div>
                                                          <div class="column-ID-top">-</div>
                                                      </div>
                                                      <div class="select-column-bar-top" onclick="toggleDropdown(this)">Select a column from csv...
      
                                              
                                                          <div class="open-dropdown"></div>
                                                      </div>
                                                      <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                      </div>
                                                  </div>
                                                  <div class="container-item" id="${containerItemId}">

                                                  </div>
                                                  <!-- Botão para adicionar novo item -->
                                                  <div class="add-item-btn" id="${addItemBtnId}" onclick="toggleAddItemDropdown('${dropdownId}', '${newContainer.id}')" style="margin-top: 10px; color=#FFFFFF;">
    Add Action
    
                                          
                                                      <!-- SVG ícone -->
                                                      <div class="icon-add-action"></div>
                                                  </div>
                                                  <!-- Dropdown para selecionar tipo de novo item -->
                                                  <div class="dropdown-add-action" id="${dropdownId}">
                                                      <div class="dropdown-add-item-content" onclick="addItem('duplicate-rename', '${newContainer.id}')">Duplicate & Rename</div>
                                                      <div class="dropdown-add-item-content" onclick="addItem('render-pass', '${newContainer.id}')">Render Pass Group</div>
                                                      <div class="dropdown-add-item-content" onclick="addItem('text-layer', '${newContainer.id}')">Text Layer</div>
                                                      <div class="dropdown-add-item-content" onclick="addItem('media-layer', '${newContainer.id}')">Media Layer</div>
                                                  </div>




      `;
    allContainer.appendChild(newContainer); // Add the new container to the "all" div
    // Initialize Sortable for the new container
    const containerItem = newContainer.querySelector(`#${containerItemId}`);
    const sortable = Sortable.create(containerItem, {
      animation: 250,
      ghostClass: 'ortable-ghost',
      group: {
        name: 'group-item', // Name of the group updated
        pull: true, // Permitir que os elementos sejam movidos
        put: ['group-item', 'other-container-id'], // Permitir que os elementos sejam movidos para outro container
      },
      handle: '.item,.group',
      onEnd: function(evt) {
        var itemEl = evt.item; // dragged HTMLElement
        evt.from; // previous list
        evt.to; // target list
        evt.oldIndex; // element’s old index within old parent
        evt.newIndex; // element’s new index within new parent
      },
    });
    // Initialize Sortable for the container-master-ID
    const containerMasters = document.querySelectorAll('.container-master');
    Sortable.create(all, {
      animation: 250,
      ghostClass: 'ortable-ghost',
      group: {
        name: 'group-master', // Name of the group updated
        pull: 'clone',
        put: false,
      },
      filter: '.container-master-', // Only allow sorting of container-master-ID elements
      onEnd: function(evt) {
        // Função de callback para quando o item é solto
      },
    });
  }
  // Função para adicionar novo item e atualizar os dropdowns
  function addItem(type, containerId) {
    var container = document.getElementById(containerId);
    var containerItem = container.querySelector('.container-item');
    var newItem;
    var uniqueId = Math.floor(Math.random() * 100); // generate a unique ID
    switch (type) {
      case 'duplicate-rename':
        newItem = `
        
                                      
                                                  <div class="group">
                                                      <div class="item" id="${generateUniqueId('duplicate-rename')}">
                                                          <div class="left-bar-dr"></div>
                                                          <div class="content-bar">
                                                              <div class="action-title">Duplicate & Rename</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
            
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                          </div>
                                                      </div>
                                                  </div>
        `;
        break;
      case 'render-pass':
        newItem = `
        
                                      
                                                  <div class="group">
                                                      <div class="item-group" id="${generateUniqueId('render-pass')}">
                                                          <div class="left-bar-rp"></div>
                                                          <div class="content-bar">
                                                              <div class="action-title">Render Pass</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
              
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                          </div>
                                                      </div>
                                                      <div class="spacer"></div>
                                                      <div class="item-group" id="${generateUniqueId('render-codec')}">
                                                          <div class="left-bar-rp"></div>
                                                          <div class="content-bar">
                                                              <div class="action-title">Codec Preset</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
              
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content">

                                                          </div>
                                                      </div>
                                                      <div class="spacer"></div>
                                                      <div class="item-group" id="${generateUniqueId('render-path')}">
                                                          <div class="left-bar-rp"></div>
                                                          <div class="content-bar">
                                                              <div class="action-title">Output Path</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
              
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                          </div>
                                                      </div>
                                                      <div class="spacer"></div>
                                                      <div class="item-group" id="${generateUniqueId('render-name')}">
                                                          <div class="left-bar-rp"></div>
                                                          <div class="content-bar" id="${generateUniqueId('dropdown-content')}">
                                                              <div class="action-title">File Name</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
              
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                          </div>
                                                      </div>
                                                  </div>
        `;
        break;
      case 'text-layer':
        newItem = `
        
                                      
                                                  <div class="group">
                                                      <div class="item" id="${generateUniqueId('text-layer')}">
                                                          <div class="left-bar-tl"></div>
                                                          <div class="content-bar">
                                                              <div class="action-title">Text Layer</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
            
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                          </div>
                                                      </div>
                                                      <div class="spacer"></div>
                                                      <div class="item" id="${generateUniqueId('text-content')}">
                                                          <div class="left-bar-tl"></div>
                                                          <div class="content-bar">
                                                              <div class="action-title">Text Content</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
            
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                          </div>
                                                      </div>
                                                  </div>
        `;
        break;
      case 'media-layer':
        newItem = `
        
                                      
                                                  <div class="group">
                                                      <div class="item" id="${generateUniqueId('media-layer')}">
                                                          <div class="left-bar-ml"></div>
                                                          <div class="content-bar">
                                                              <div class="action-title">Media Layer</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
            
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                          </div>
                                                      </div>
                                                      <div class="spacer"></div>
                                                      <div class="item" id="${generateUniqueId('media-path')}">
                                                          <div class="left-bar-ml"></div>
                                                          <div class="content-bar">
                                                              <div class="action-title">Media Path</div>
                                                              <div class="column-ID">-</div>
                                                          </div>
                                                          <div class="select-column-bar" onclick="toggleDropdown(this)">Select a column from csv...
            
                                                  
                                                              <div class="open-dropdown"></div>
                                                          </div>
                                                          <div class="dropdown-content" id="${generateUniqueId('dropdown-content')}">

                                                          </div>
                                                      </div>
                                                  </div>
    `;
        break;
        // Find the closest group elements
        var groups = containerItem.querySelectorAll('.group');
        var closestGroupIndex = -1;
        var closestGroupDistance = Infinity;
        for (var i = 0; i < groups.length; i++) {
          var groupRect = groups[i].getBoundingClientRect();
          var mousePosition = getMousePosition(); // get the mouse position
          var distance = Math.abs(groupRect.top + groupRect.height / 2 - mousePosition.y);
          if (distance < closestGroupDistance) {
            closestGroupIndex = i;
            closestGroupDistance = distance;
          }
        }
        // Insert the new item between the closest groups
        if (closestGroupIndex !== -1) {
          var newElement = document.createElement('div');
          newElement.innerHTML = newItem;
          containerItem.insertBefore(newElement, groups[closestGroupIndex].nextSibling);
        }
    }
    // Cria um novo elemento div com o conteúdo do newItem
    var newElement = document.createElement('div');
    newElement.innerHTML = newItem;
    // Adiciona o novo elemento como penúltimo filho do containerItem
    var lastChild = containerItem.children[containerItem.children.length - 0];
    containerItem.insertBefore(newElement, lastChild);
    // Atualiza todos os novos dropdowns
    const newDropdowns = newElement.querySelectorAll('.dropdown-content');
    if (newDropdowns && csvDataGlobal.length > 0) {
      newDropdowns.forEach(newDropdown => {
        newDropdown.innerHTML = ''; // Limpa o conteúdo do container
        csvDataGlobal.forEach((cell, index) => {
          const outputDiv = document.createElement('div');
          outputDiv.className = 'dropdown-content-csvlist'; // Cria um novo div com a classe "dropdown-item-csv"
          outputDiv.setAttribute('onclick', 'selectColumn(this)'); // Adiciona o evento onclick
          const cellText = document.createElement('span');
          cellText.textContent = cell;
          const columnLetter = document.createElement('span');
          columnLetter.textContent = String.fromCharCode(64 + index + 1); // A=1, B=2,...
          outputDiv.appendChild(cellText);
          outputDiv.appendChild(columnLetter);
          newDropdown.appendChild(outputDiv); // Adiciona o novo div ao container
        });
      });
    }
    updateSelectedClasses(); // Atualiza a classe dos dropdown-content-csvlist para .selected
    closeAllDropdowns();
  }
  addContainer();