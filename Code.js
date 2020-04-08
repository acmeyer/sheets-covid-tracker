/**
 * @OnlyCurrentDoc
 */

const createMenu = () => {
  // Create the custom menu
  var ui = SpreadsheetApp.getUi();

  var menu = ui.createMenu('COVID Tracking')
    .addItem('Refresh Sheet', 'menuRefreshSheet')
    .addItem('Documentation', 'menuDocumentation')
    .addItem('More Info', 'menuMoreInfo');
  menu.addToUi();
}

const onInstall = (e) => {
  onOpen(e);
}

const onOpen = (e) => {
  createMenu();
}

const menuDocumentation = () => {
  var html = HtmlService.createHtmlOutputFromFile('Documentation')
      .setTitle('Documenation')
      .setWidth(300);
  SpreadsheetApp.getUi()
      .showSidebar(html);
}

const menuMoreInfo = () => {
  var ui = SpreadsheetApp.getUi();
  var alert = ui.alert(
    'More Info', 
    'Website: https://covidtracking.com/\n API Documentation: https://covidtracking.com/api', 
    ui.ButtonSet.OK
  );
}

const menuRefreshSheet = () => {
  recalculate();
}

const recalculate = () => { 
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0;i < sheets.length;i++) {
    refreshSheet(sheets[i]);
  }
}

const refreshSheet = (sheet) => {
  var s = SpreadsheetApp.getActiveSheet();
  if (typeof sheet !== "undefined") {
    s = sheet
  }
  var data = s.getDataRange();
  var cells = findFunctions(data);
  for (var i = 0;i < cells.length;i++) {
    var formula = cells[i].getFormula();
    cells[i].clearContent();
    SpreadsheetApp.flush();
    Utilities.sleep(50);
    cells[i].setValue(formula);
  }
}

const findFunctions = (data) => {
  var allFormulas = data.getFormulas();
  var response = [];
  for (var i = 0;i < allFormulas.length;i++) {
    for (var j = 0;j < allFormulas[i].length;j++) {
      if (
        allFormulas[i][j].indexOf('GET_STATES_CURRENT_DATA_RAW') > -1 ||
        allFormulas[i][j].indexOf('GET_STATES_HISTORICAL_DATA_RAW') > -1 ||
        allFormulas[i][j].indexOf('GET_STATES_DATA') > -1 ||
        allFormulas[i][j].indexOf('GET_US_CURRENT_DATA_RAW') > -1 ||
        allFormulas[i][j].indexOf('GET_US_HISTORICAL_DATA_RAW') > -1 ||
        allFormulas[i][j].indexOf('GET_US_DATA') > -1
      ) {
        response.push(data.getCell(i + 1, j + 1));
      }
    }
  }
  return response;
}

const returnDateFromString = (string) => {
  return Date.parse(string);
}

const getDataForDate = (data, date) => {
  const dateArg = moment(date).valueOf();
  return data.find(d => {
    const dataDate = moment(d['date'], 'YYYYMMDD').valueOf();
    return dataDate === dateArg;
  });
}

const getDateData = (data, date) => {
  if (date) {
    eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js').getContentText());
    if (Array.isArray(date)) {
      return date.map(d => getDataForDate(data, d[0]));
    }
    return getDataForDate(data, date);
  } else {
    return data[0];
  }
}

const getResultsFromData = (dateData, data) => {
  if (Array.isArray(data)) {
    let dataArray = data[0];
    const mappedData = dataArray.map(d => {
      if (!dateData) { return ''; }
      const result = dateData[d];
      if (!result) { return ''; }
      return result;
    });
    return [mappedData];
  } else {
    const result = dateData[data];
    if (!result) {
      return '';
    }
    return dateData[data];
  }
}


const fetchAPIData = (endpoint) => {
  const url = 'https://covidtracking.com/api/' + endpoint;
  const response = UrlFetchApp.fetch(url);
  const json = JSON.parse(response.getContentText());
  
  return json;
}

const fetchStatesData = (state, data, date) => {
  const endpoint = 'states/daily';
  const json = fetchAPIData(endpoint);
  if (!json) {
    throw 'Could not find data.';
  }

  const stateData = json.filter(row => row['state'] === state);
  const dateData = getDateData(stateData, date);
  if (Array.isArray(dateData)) {
    return dateData.map(d => {
      const output = getResultsFromData(d, data);
      if (Array.isArray(output)) {
        return output[0];
      }
      return output;
    });
  }
  return getResultsFromData(dateData, data);
}

const fetchUSData = (data, date) => {
  const endpoint = 'us/daily';
  const json = fetchAPIData(endpoint);
  if (!json) {
    throw 'Could not find data.';
  }

  const dateData = getDateData(json, date);
  if (Array.isArray(dateData)) {
    const results = dateData.map(d => {
      const output = getResultsFromData(d, data);
      if (Array.isArray(output)) {
        return output[0];
      }
      return output;
    });
    return results;
  }
  return getResultsFromData(dateData, data);
}

const mapJSONToArray = (data) => {
  const headers = Object.keys(data[0]);
  const body = data.map((d) => {
    let result = [];
    headers.forEach((h) => {
      result = result.concat(d[h]);
    });
    return result;
  });

  const results = [
    headers, 
    ...body
  ];
  return results;
}

/**
 * Returns raw current data for all states.
 *
 * @return Raw current data for states.
 * @customfunction
 */
const GET_STATES_CURRENT_DATA_RAW = () => {
  const json = fetchAPIData('states');
  if (!json) {
    throw 'Could not find data.';
  }
  return mapJSONToArray(json);
}

/**
 * Returns raw historical data for all states.
 *
 * @return Raw historical data for states.
 * @customfunction
 */
const GET_STATES_HISTORICAL_DATA_RAW = () => {
  const json = fetchAPIData('states/daily');
  if (!json) {
    throw 'Could not find data.';
  }
  return mapJSONToArray(json);
}

/**
 * Returns states data.
 *
 * @param {"NY"} state The state to look up.
 * @param {"positive|negative|pending"} data The type of data you want. See documentation for full list.
 * @param {"03/20/2020"} date [optional] The date or range of dates for the data desired. If none is given, the most recent is used.
 * @return States related data.
 * @customfunction
 */
const GET_STATES_DATA = (state, data, date) => {
  const results = fetchStatesData(state, data, date);
  return results;
}

/**
 * Returns raw current data for entire US.
 *
 * @return Raw current data for US.
 * @customfunction
 */
const GET_US_CURRENT_DATA_RAW = () => {
  const json = fetchAPIData('us');
  if (!json) {
    throw 'Could not find data.';
  }

  return mapJSONToArray(json);
}

/**
 * Returns raw historical data for entire US.
 *
 * @return Raw historical data for US.
 * @customfunction
 */
const GET_US_HISTORICAL_DATA_RAW = () => {
  const json = fetchAPIData('us/daily');
  if (!json) {
    throw 'Could not find data.';
  }
  return mapJSONToArray(json);
}

/**
 * Returns US data.
 *
 * @param {"positive|negative|pending"} data The type of data you want. See documentation for full list.
 * @param {"03/20/2020"} date [optional] The date or range of dates for the data desired. If none is given, the most recent is used.
 * @return US related data.
 * @customfunction
 */
const GET_US_DATA = (data, date) => {
  const results = fetchUSData(data, date);
  return results;
}
