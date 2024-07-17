// Create a panel with a text field and a button
var panel = new Window("palette", "Save Text to JSON", undefined);
var textField = panel.add("edittext", undefined, "Enter text here");
var button = panel.add("button", undefined, "Save to JSON");

// Add an event listener to the button
button.onClick = function() {
  // Get the text from the text field
  var text = textField.text;

  // Create a JSON object
  var jsonData = {};
  jsonData.text = text;

  // Convert the JSON object to a string
  var jsonString = JSON.stringify(jsonData);

  // Show the "Save As" dialog box
  var file = new File();
  var saveDlg = file.saveDlg("Save JSON file", "JSON files (*.json):*.json");
  if (saveDlg) {
    // Get the file path selected by the user
    var filePath = saveDlg;

    // Save the JSON string to the selected file
    var fileToSave = new File(filePath);
    fileToSave.open("w");
    fileToSave.write(jsonString);
    fileToSave.close();
  }
}

// Show the panel
panel.show();