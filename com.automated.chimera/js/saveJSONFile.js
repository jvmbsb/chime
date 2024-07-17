document.addEventListener('DOMContentLoaded', function() {
  const csInterface = new CSInterface();
  csInterface.evalScript('$.evalFile("' + csInterface.getSystemPath(SystemPath.EXTENSION) + '/jsx/saveFile.jsx")');

  document.getElementById('save-json-btn').addEventListener('click', function() {
      const data = saveToTxt();
      csInterface.evalScript('saveJSONFile(' + JSON.stringify(data) + ')');
  });
});


function saveToTxt() {
    const allDiv = document.getElementById('all');
    const containers = Array.from(allDiv.querySelectorAll('.container-master')).sort((a, b) => {
        const idA = parseInt(a.id.replace('container-master-', ''), 10);
        const idB = parseInt(b.id.replace('container-master-', ''), 10);
        return idA - idB;
    });
  
    const data = {};
  
    // Itera sobre cada container-master
    containers.forEach(container => {
        const containerId = container.id;
        const containerData = {
            "Comp Name": container.querySelector('.column-ID-top').textContent.trim()
        };
  
        // Seleciona os elementos dentro do container-master
        container.querySelectorAll('.item-group, .group').forEach(itemGroup => {
            const groupId = itemGroup.id;
  
            // Seleciona os elementos dentro do item-group
            itemGroup.querySelectorAll('.action-title').forEach(actionTitle => {
                const actionTitleText = actionTitle.textContent.trim();
                const columnId = actionTitle.parentNode.querySelector('.column-ID').textContent.trim();
                containerData[actionTitleText] = columnId;
            });
        });
  
        // Adiciona os dados do container ao objeto principal
        data[containerId] = [containerData];
    });
  
    // Log the data object for debugging purposes
    console.log(data);
  
    // Converte o objeto data em uma string JSON
    const dataStr = JSON.stringify(data, null, 2);
  
    // Cria um elemento <a> para baixar o arquivo
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr);
    downloadAnchor.download = 'data.txt';
  
    // Adiciona o elemento <a> ao documento, clica nele e o remove em seguida
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  
    // Optionally return the data for further use
    return data;
  }
  


/*
function saveToTxt() {
  const allDiv = document.getElementById('all');
  const containers = Array.from(allDiv.querySelectorAll('.container-master')).sort((a, b) => {
      const idA = parseInt(a.id.replace('container-master-', ''), 10);
      const idB = parseInt(b.id.replace('container-master-', ''), 10);
      return idA - idB;
  });
  
  const data = {};
  
  // Itera sobre cada container-master
  containers.forEach(container => {
      const containerId = container.id;
      const containerData = {
          "Comp Name": container.querySelector('.column-ID-top').textContent.trim()
      };
      
      // Seleciona os elementos dentro do container-master
      container.querySelectorAll('.item-group, .group').forEach(itemGroup => {
          const groupId = itemGroup.id;
          
          // Seleciona os elementos dentro do item-group
          itemGroup.querySelectorAll('.action-title').forEach(actionTitle => {
              const actionTitleText = actionTitle.textContent.trim();
              const columnId = actionTitle.parentNode.querySelector('.column-ID').textContent.trim();
              containerData[actionTitleText] = columnId;
          });
      });
      
      // Adiciona os dados do container ao objeto principal
      data[containerId] = [containerData];
  });
  
  // Log the data object for debugging purposes
  console.log(data);
  
  // Optionally return the data for further use
  return data;
}
*/