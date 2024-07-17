function saveDataList(data) {
    var folder = Folder.myDocuments.absoluteURI + '/chimera';
    var filePath = folder + '/data.json'
    var file = new File(filePath);

    file.open("w");
    file.write(JSON.stringify(data, null, 2));
    file.close();
}
