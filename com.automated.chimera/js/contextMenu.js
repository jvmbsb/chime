let contextTargetGroup = null;
let mousePosition = null;
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
  const contextMenu = document.getElementById('context-menu');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  contextMenu.style.top = `${event.clientY + scrollTop}px`;
  contextMenu.style.left = `${event.clientX + scrollLeft}px`;
  contextMenu.style.display = 'block'
  // Armazena a referência ao elemento no qual o botão direito foi clicado
  contextTargetGroup = event.target.closest('.group') || event.target.closest('.container-master')
  // Calcula a posição do mouse
  mousePosition = {
    x: event.clientX,
    y: event.clientY
  };
  // Encontra os dois grupos mais próximos da posição do mouse
  const containerItem = contextTargetGroup.closest('.container-item');
  const groups = containerItem.querySelectorAll('.group');
  let closestGroup1 = null;
  let closestGroup2 = null;
  let closestDistance1 = Infinity;
  let closestDistance2 = Infinity;
  for (let i = 0; i < groups.length; i++) {
    const groupRect = groups[i].getBoundingClientRect();
    const distance = Math.abs(groupRect.top + groupRect.height / 2 - mousePosition.y);
    if (distance < closestDistance1) {
      closestGroup2 = closestGroup1;
      closestDistance2 = closestDistance1;
      closestGroup1 = groups[i];
      closestDistance1 = distance;
    } else if (distance < closestDistance2) {
      closestGroup2 = groups[i];
      closestDistance2 = distance;
    }
  }
  // Armazena as referências aos dois grupos mais próximos
  contextClosestGroup1 = closestGroup1;
  contextClosestGroup2 = closestGroup2;
});
document.addEventListener('click', function() {
  const contextMenu = document.getElementById('context-menu');
  contextMenu.style.display = 'none';
});
// Função para gerar IDs únicos para container-master
function getAvailableId() {
  let id = 1;
  while (document.getElementById(`container-master-${id}`)) {
    id++;
  }
  return `container-master-${id}`;
}
// Função para duplicar o elemento alvo
function duplicateDiv() {
  if (contextTargetGroup) {
    if (contextTargetGroup.classList.contains('group')) {
      const newElement = contextTargetGroup.cloneNode(true);
      const containerItem = contextTargetGroup.closest('.container-item');
      if (containerItem) {
        const newContainer = document.createElement('div'); // Criar uma nova div para os elementos duplicados
        containerItem.appendChild(newContainer); // Adicionar a nova div ao container-item pai
        newContainer.appendChild(newElement); // Adicionar o novo elemento à nova div
        // Gerar IDs únicos para os elementos replicados
        newElement.querySelectorAll('[id]').forEach(element => {
          let originalId = element.id;
          let match = originalId.match(/(.*)-(\d+)$/);
          if (match) {
            let prefix = match[1];
            let newId = `${prefix}-${Math.floor(Math.random() * 1000000000)}`;
            element.id = newId;
          } else {
            element.id = generateUniqueId(element.tagName.toLowerCase());
          }
        });
      } else {
        console.error('Container item not found.');
      }
    } else if (contextTargetGroup.classList.contains('container-master')) {
      const newElement = contextTargetGroup.cloneNode(true);
      const parentContainer = contextTargetGroup.parentElement;
      if (parentContainer) {
        const newId = getAvailableId(); // Obter um novo ID único para container-master
        newElement.id = newId; // Definir o novo ID no elemento duplicado
        // Gerar IDs únicos para os elementos replicados dentro de container-master
        newElement.querySelectorAll('[id]').forEach(element => {
          let originalId = element.id;
          let match = originalId.match(/(.*)-(\d+)$/);
          if (match) {
            let prefix = match[1];
            let newId = `${prefix}-${Math.floor(Math.random() * 1000000000)}`;
            element.id = newId;
          } else {
            element.id = generateUniqueId(element.tagName.toLowerCase());
          }
        });
        // Ajustar IDs específicos para container-master
        const containerItemId = `container-item-${newId}`;
        const addItemBtnId = `add-item-btn-${newId}`;
        const dropdownId = `dropdown-add-item-${newId}`;
        // Ajustar IDs e eventos específicos dentro do elemento duplicado
        const addItemBtn = newElement.querySelector('.add-item-btn');
        if (addItemBtn) {
          addItemBtn.id = addItemBtnId;
          addItemBtn.setAttribute('onclick', `toggleAddItemDropdown('dropdown-add-item-${newId}', '${newId}')`);
        }
        const dropdown = newElement.querySelector('.dropdown-add-action');
        if (dropdown) {
          dropdown.id = `dropdown-add-item-${newId}`;
          dropdown.querySelectorAll('.dropdown-add-item-content').forEach(item => {
            const itemType = item.getAttribute('onclick').split(',')[0].split('(')[1].replace(/'/g, '');
            item.setAttribute('onclick', `addItem('${itemType}', '${newId}')`);
          });
        }
        const containerItem = newElement.querySelector('.container-item');
        if (containerItem) {
          containerItem.id = containerItemId;
        }
        parentContainer.appendChild(newElement); // Adicionar o novo elemento diretamente ao parentContainer
        // Initialize Sortable on the duplicated container-master
        const newContainerItem = newElement.querySelector('.container-item');
        const newSortable = Sortable.create(newContainerItem, {
          animation: 250,
          ghostClass: 'ortable-ghost',
          group: {
            name: 'group-item',
            pull: true,
            put: ['group-item', 'other-container-id'],
          },
          handle: '.item,.group',
          onEnd: function(evt) {
            // Função de callback para quando o item é solto
          },
        });
      } else {
        console.error('Parent container not found.');
      }
    }
  } else {
    console.error('Target group element not found.');
  }
}
// Função para gerar IDs únicos genéricos
function generateUniqueId(tagName) {
  return `${tagName}-${Math.floor(Math.random() * 1000000000)}`;
}

function deleteGroupItem() {
  if (contextTargetGroup) {
    contextTargetGroup.remove();
  }
}
document.getElementById('minimizeButton').addEventListener('click', function() {
  minimizeFunction();
});
const minimizeButton = document.getElementById('minimizeButton');
minimizeButton.addEventListener('click', function(event) {
  event.preventDefault();
  const container = contextTargetGroup.closest('.container-master');
  if (container) {
    const isMinimized = container.classList.contains('container-master-mini');
    if (isMinimized) {
      container.classList.remove('container-master-mini');
      const actionTitleTop = container.querySelector('.action-title-top-mini');
      const selectColumnBarTop = container.querySelector('.select-column-bar-top-mini');
      const columnIdTop = container.querySelector('.column-ID-top-mini');
      if (actionTitleTop) actionTitleTop.classList.remove('action-title-top-mini');
      if (selectColumnBarTop) selectColumnBarTop.classList.remove('select-column-bar-top-mini');
      if (columnIdTop) columnIdTop.classList.remove('column-ID-top-mini');
    } else {
      container.classList.add('container-master-mini');
      const actionTitleTop = container.querySelector('.action-title-top');
      const selectColumnBarTop = container.querySelector('.select-column-bar-top');
      const columnIdTop = container.querySelector('.column-ID-top');
      if (actionTitleTop) actionTitleTop.classList.add('action-title-top-mini');
      if (selectColumnBarTop) selectColumnBarTop.classList.add('select-column-bar-top-mini');
      if (columnIdTop) columnIdTop.classList.add('column-ID-top-mini');
    }
  }
  document.getElementById('contextMenuContainer').style.display = 'none';
});

function minimizeFunction(container) {
  if (container) {
    const isMinimized = container.classList.contains('container-master-mini');
    if (isMinimized) {
      container.classList.remove('container-master-mini');
      const actionTitleTop = container.querySelector('.action-title-top-mini');
      const selectColumnBarTop = container.querySelector('.select-column-bar-top-mini');
      const columnIdTop = container.querySelector('.column-ID-top-mini');
      if (actionTitleTop) actionTitleTop.classList.remove('action-title-top-mini');
      if (selectColumnBarTop) selectColumnBarTop.classList.remove('select-column-bar-top-mini');
      if (columnIdTop) columnIdTop.classList.remove('column-ID-top-mini');
    } else {
      container.classList.add('container-master-mini');
      const actionTitleTop = container.querySelector('.action-title-top');
      const selectColumnBarTop = container.querySelector('.select-column-bar-top');
      const columnIdTop = container.querySelector('.column-ID-top');
      if (actionTitleTop) actionTitleTop.classList.add('action-title-top-mini');
      if (selectColumnBarTop) selectColumnBarTop.classList.add('select-column-bar-top-mini');
      if (columnIdTop) columnIdTop.classList.add('column-ID-top-mini');
    }
  }
}
// Adicionar event listeners para desfazer o minimize
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('column-ID-top-mini') || event.target.classList.contains('column-ID-mini')) {
    const container = event.target.closest('.container-master');
    if (container) {
      minimizeFunction(container);
    }
  }
});
// Define the groups variable
const groups = document.querySelectorAll('.group')
groups.forEach((group) => {
  group.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    contextTargetGroup = group;
    document.getElementById('context-menu').style.display = 'block';
    document.getElementById('context-menu').style.top = `${event.clientY}px`;
    document.getElementById('context-menu').style.left = `${event.clientX}px`;
  });
  // Add event listener to inner divs to redirect to the group div
  group.querySelectorAll('div').forEach((innerDiv) => {
    innerDiv.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event propagation
      group.dispatchEvent(new Event('click')); // Dispatch click event on the group div
    });
  });
});

function deleteDiv() {
  deleteGroupItem();
}