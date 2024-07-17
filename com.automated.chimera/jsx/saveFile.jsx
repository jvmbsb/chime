function saveJSONFile(data) {
    // Exibir caixa de diálogo para selecionar a pasta e nome do arquivo
    var file = File.saveDialog("Save JSON File", "Arquivos JSON:*.json");

    if (file != null) {
        if (file.exists) {
            // Arquivo já existe, perguntar se deseja substituir
            var response = confirm("O arquivo '" + file.name + "' já existe. Deseja substituir?");
            if (!response) {
                // Usuário não deseja substituir, cancelar operação
                return;
            }
        }

        file.open("w");
        file.write(JSON.stringify(data, null, 2));
        file.close();
        alert("Arquivo salvo com sucesso!");
    }
}
