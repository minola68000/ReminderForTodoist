// You MUST set in the project properties:
// remindWebHook : WebHook URL for sending remind

// You CAN set in the project properties:
// errorTo : Mail address in project property if you want receive error info.
// hash : Hash parameter when receiving a post. If not set, skip hash validation.

// Set mail address in project property if you want receive error info.
const ERROR_TO = PropertiesService.getScriptProperties().getProperty('errorTo');
const IS_DEBUG = true;

// Magic number handling
const NOT_FOUND = 0;
const COL_NAME  = 1;
const COL_LINK  = 6;
const COL_DATE  = 7;

// Main function and entry point of the trigger.
////////////////////////////////////////////////////////////////
function ckeckReminder() {
  // Get all sheet rows into a varriable.
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var dat = sheet.getDataRange().getValues();

  } catch (e) {
    errorOccured('Failed to get sheet object: ' + e);
    return;
  }
  if ( ! dat) return;

  // Notification timings.
  const HALF_HOUR  = 30;
  const ONE_HOUR   = 60;
  const ONE_DAY    = ONE_HOUR * 24;
  const THREE_DAYS = ONE_DAY * 3;
  const ONE_WEEK   = ONE_DAY * 7;
  const ONE_MONTH  = ONE_DAY * 30;
  const CYCLE      = 15; // mintues

  var targetDate;
  for (var i = START_FROM; i < dat.length; i++) {
    if (0 < dat[i][COL_DATE - 1].length) {
      targetDate = new Date(dat[i][COL_DATE - 1]);
      var diff = (targetDate - new Date()) / (1000 * 60); // minutes
      DLog(`[${i}] ${dat[i][COL_NAME - 1]} / ${diff}minutes rest`);

      // Already overdued....
      if (diff <= 0) continue;

      var pj = dat[i][0];
      if (determineSending(diff, HALF_HOUR, pj)) continue;
      if (determineSending(diff, ONE_HOUR , pj)) continue;
      if (determineSending(diff, ONE_DAY  , pj)) continue;
      if (determineSending(diff, ONE_DAY  , pj)) continue;
      if (determineSending(diff, ONE_WEEK , pj)) continue;
      if (determineSending(diff, ONE_MONTH, pj)) continue;
      // if (determineSending(diff, HALF_HOUR, pj)) continue; // You can cancel to comment out a line.
    }
  }

  // Detemine sending reminder or not.
  // true : YES sent
  // false: NOT sent
  //--------------------------------------------------------------
  function determineSending(diff, timing, pj) {
    if (timing <= diff && diff < timing + CYCLE) {
      sendReminder(message(pj, timing));
      return true;
    
    } else {
      return false;
    }
  }
  
  // Human readable string from minutes. You can localize here.
  //--------------------------------------------------------------
  function spanFromMinutes(minutes) {
    switch (minutes) {
      case HALF_HOUR:
        return '30分';
      case ONE_HOUR:
        return '1時間';
      case ONE_DAY:
        return '1日';
      case THREE_DAYS:
        return '3日';
      case ONE_WEEK:
        return '1週間';
      case ONE_MONTH:
        return '1ヶ月';
      default:
        return '<不明>';
    }
  }

  // Actual string to send. You can localize here.
  //--------------------------------------------------------------
  function message(pj, rest) {
    return `${pj}があと${spanFromMinutes(rest)}でしめきりです`;
  }

}

// Actually send a reminder LINE or Notification (IFTTT webhook so up to you)
////////////////////////////////////////////////////////////////
function sendReminder(message) {
  const webHookToRemind = PropertiesService.getScriptProperties().getProperty('remindWebHook');
  if ( ! webHookToRemind) return handleError('There is no remindWebHook setting in the project property!');

  var options = {
    "method" : "GET",
  }

  // A message is related as value1 parameter.
  var url = `${webHookToRemind}?value1=${message}`;
  try {
    var response = UrlFetchApp.fetch(url, options);
    response.getContentText("UTF-8");
    return true;

  } catch (e) {
    return false;
  }

}

// Post handling (Todo deletion in Todoist)
////////////////////////////////////////////////////////////////
function doPost(postData) {

  // Preparing variables
  try {
    var command = decodeURIComponent(postData.parameters.command.toString());
    var id      = decodeURIComponent(postData.parameters.id.toString());
    var hash    = decodeURIComponent(postData.parameters.hash.toString());
    
  } catch (e) {
    
    handleError('No or Invalid parameter: ' + e);
    return;
  }
  
  if (   PropertiesService.getScriptProperties().getProperty('hash')
      && hash != PropertiesService.getScriptProperties().getProperty('hash')) {
    errorOccured('Invalid hash value: ' + e);
    return;
  }
  
  var row = 0;
  var sheet = SpreadsheetApp.getActiveSheet();
  switch (command) {
    case 'delete':
      row = findRow(sheet, id, COL_LINK);
      // delete
      if (NOT_FOUND == row) {
        errorOccured('Unknown TODO: ' + id);
      } else {
        sheet.deleteRows(row);
      }
      break;
    default:
      errorOccured('Unknown command: ' + command);
  }
  
}

// Find collect row in a spread sheet for the value
////////////////////////////////////////////////////////////////
const START_FROM = 0;
function findRow(sheet, val, col) {
  if ( ! sheet) sheet = SpreadsheetApp.getActiveSheet();
  
  try {
    var dat = sheet.getDataRange().getValues();
  } catch (e) {
    return 0;
  }

  for (var i = START_FROM; i < dat.length; i++) {
    if (dat[i][col - 1] === val) {
      DLog('found!:' + i);
      return i + 1;
    }
  }
  DLog('NOT found!');
  return 0;
}

// Error info mail
////////////////////////////////////////////////////////////////
function handleError(body) {
  console.log(body);
  if ( ! ERROR_TO) return false;
  
  try {
    MailApp.sendEmail({
      to     : ERROR_TO,
      subject: body,
      body   : body,
    })
    return true;

  } catch (e) {
    return false;
  }
}

function DLog(contents) {
  if ( ! IS_DEBUG) return;
  Logger.log(`${contents}`);
}