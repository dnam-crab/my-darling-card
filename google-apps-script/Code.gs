const SHEET_NAME = "Responses";

function doPost(event) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  const payload = JSON.parse(event.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Submitted at", "Date", "Time", "Food"]);
  }

  sheet.appendRow([
    new Date(payload.submittedAt || Date.now()),
    payload.date || "",
    payload.time || "",
    payload.food || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
