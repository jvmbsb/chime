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
}

// Função para atualizar as classes .selected em todos os dropdowns
function updateSelectedClasses() {
  // Atualizar todas as divs .dropdown-content-csvlist com a classe .selected conforme as seleções feitas
  Object.keys(selectedItems).forEach(dropdownId => {
    const dropdown = document.getElementById(dropdownId);
    const dropdownItems = dropdown.querySelectorAll('.dropdown-content-csvlist');
    dropdownItems.forEach(item => {
      const itemText = item.children[0].textContent;
      const itemNumber = item.children[1].textContent;
      if (itemText === selectedItems[dropdownId].text && itemNumber === selectedItems[dropdownId].number) {
        item.classList.add('selected');
        item.classList.add('another-class'); // Adiciona uma segunda classe
      } else {
        item.classList.remove('selected');
        item.classList.remove('another-class'); // Remove a segunda classe se não for selecionado
      }
    });
  });
}

// Função para fechar o dropdown se clicar fora dele
window.onclick = function(event) {
  if (!event.target.matches('.select-column-bar, .open-dropdown') && !event.target.matches('.select-column-bar-top, .open-dropdown') && !event.target.matches('.add-item-btn, .icon-add-action') && !event.target.closest('.dropdown-content') && !event.target.closest('.dropdown-add-action')) {
    closeAllDropdowns();
  }
}