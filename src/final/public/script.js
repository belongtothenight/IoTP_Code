import { DRroutine, InitInfoSources, InitInfoAPI1, InitInfoAPI2, DRsingleRun, DataRetrieve } from './dataRetrieve.js';
import { Reader, initInfoReader, read } from './reader.js';
import { FirebaseRealtimeDatabase, restructureDatabase, writeDatabase, readDatabase, } from './database.js';

////////////////////////////////////////////////////////////////////////////////////////
// Global variables

var APIs = {}; // store API names
var API1_flag = { location: false, item: false };
var API2_flag = { location: false, item: false };
var voices; // store speech synthesis voices
var selectedVoice; // store selected speech synthesis voice
var databaseConnectionTimeout = 20; // timeout for database connection in seconds

////////////////////////////////////////////////////////////////////////////////////////
// Webpage element functions

document.addEventListener('DOMContentLoaded', async function () {
    const startTime = Date.now();

    console.clear();
    initWebpageElementSources();
    APIs = await initWebpageElementAPI1(APIs);
    APIs = await initWebpageElementAPI2(APIs);
    // console.log(APIs);
    initWebpageElementReader();
    console.log('Webpage loaded');

    var id = window.setInterval(function () {
        if (Date.now() - startTime > databaseConnectionTimeout * 1000) {
            window.clearInterval(id);
            console.log('reached timeout for database connection');
            firebase.database().goOffline();
            console.log('terminated firebase realtime database connection');
        }
    }, 1000);
});

document.getElementById('API1_Location').addEventListener('change', async function () {
    var locationValue = document.getElementById('API1_Location').value;
    // make sure to select something but default option
    if (locationValue === 0) {
        console.log('no location selected');
        return;
    }
    API1_flag.location = true;
    // make sure both location and item is selected
    var flag = true;
    Object.keys(API1_flag).forEach(function (key) {
        if (API1_flag[key] === false) {
            flag = false;
        }
    });
    // all conditions are met
    if (flag) {
        // read user input
        var location = document.getElementById('API1_Location').value;
        var item = document.getElementById('API1_Item').value;
        // get value
        var returnValue = await DRsingleRun(APIs.API1, location, item);
        // console.log(returnValue);
        // get unit
        var dr = new DataRetrieve();
        var unit = dr.data.APIs[APIs.API1].itemDict[item].unit;
        var text = updateAPI1Element(returnValue, unit, item);
        read(text, selectedVoice);
    }
});

document.getElementById('API1_Item').addEventListener('change', async function () {
    var itemValue = document.getElementById('API1_Item').value;
    // make sure to select something but default option
    if (itemValue == 0) {
        console.log('no item selected');
        return;
    }
    API1_flag.item = true;
    // make sure both location and item is selected
    var flag = true;
    Object.keys(API1_flag).forEach(function (key) {
        if (API1_flag[key] === false) {
            flag = false;
        }
    });
    // all conditions are met
    if (flag) {
        // read user input
        var location = document.getElementById('API1_Location').value;
        var item = document.getElementById('API1_Item').value;
        // get value
        var returnValue = await DRsingleRun(APIs.API1, location, item);
        // console.log(returnValue);
        // get unit
        var dr = new DataRetrieve();
        var unit = dr.data.APIs[APIs.API1].itemDict[item].unit;
        var text = updateAPI1Element(returnValue, unit, item);
        read(text, selectedVoice);
    }
});

document.getElementById('API2_Location').addEventListener('change', async function () {
    var locationValue = document.getElementById('API2_Location').value;
    // make sure to select something but default option
    if (locationValue === 0) {
        console.log('no location selected');
        return;
    }
    API2_flag.location = true;
    // make sure both location and item is selected
    var flag = true;
    Object.keys(API2_flag).forEach(function (key) {
        if (API2_flag[key] === false) {
            flag = false;
        }
    });
    // all conditions are met
    if (flag) {
        // read user input
        var location = document.getElementById('API2_Location').value;
        var item = document.getElementById('API2_Item').value;
        // get value
        var returnValue = await DRsingleRun(APIs.API2, location, item);
        // get unit
        var dr = new DataRetrieve();
        var unit = dr.data.APIs[APIs.API2].itemDict[item].unit;
        console.log(returnValue, unit);
        updateAPI2Element(returnValue, unit);
        read(returnValue + unit, selectedVoice);
    }
});

document.getElementById('API2_Item').addEventListener('change', async function () {
    var itemValue = document.getElementById('API2_Item').value;
    // make sure to select something but default option
    if (itemValue == 0) {
        console.log('no item selected');
        return;
    }
    API2_flag.item = true;
    // make sure both location and item is selected
    var flag = true;
    Object.keys(API2_flag).forEach(function (key) {
        if (API2_flag[key] === false) {
            flag = false;
        }
    });
    // all conditions are met
    if (flag) {
        // read user input
        var location = document.getElementById('API2_Location').value;
        var item = document.getElementById('API2_Item').value;
        // get value
        var returnValue = await DRsingleRun(APIs.API2, location, item);
        // get unit
        var dr = new DataRetrieve();
        var unit = dr.data.APIs[APIs.API2].itemDict[item].unit;
        console.log(returnValue, unit);
        updateAPI2Element(returnValue, unit);
        read(returnValue + unit, selectedVoice);
    }
});

document.getElementById('reader').addEventListener('change', async function () {
    const readerReturn = document.getElementById('reader');
    const readerValue = readerReturn.value;
    var readerName = readerReturn.options[readerReturn.selectedIndex].text;
    // make sure to select something but default option
    if (readerValue == 0) {
        console.log('no reader selected');
        return;
    }
    // read user input
    const lang = findAndReturnVoice(readerValue, voices);
    selectedVoice = lang;
    read('Reader ' + readerName + ' selected!', lang);
});

document.getElementById('resetDatabase').addEventListener('click', async function () {
    await restructureDatabase();
    console.log('Database reset');
});

document.getElementById('resetWebsite').addEventListener('click', async function () {
    APIs = await initWebpageElementAPI1(APIs);
    APIs = await initWebpageElementAPI2(APIs);
    await initWebpageElementReader();
    initWebpageElementSources();
    console.log('Webpage reset');
});

////////////////////////////////////////////////////////////////////////////////////////
// Support functions

function initWebpageElementSources() {
    var html = '';
    var Info = InitInfoSources();
    let keys = Object.keys(Info);
    let length = keys.length;
    for (let i = 0; i < length; i++) {
        var link = '<a href="' + Info[keys[i]].link + ' target="_blank">' + Info[keys[i]].name + '</a>';
        html += `${link}<br>`;
    }
    document.getElementById('sources').innerHTML = html;
    console.log('initWebpageElementSources done');
}

async function initWebpageElementAPI1(input) {
    var html = '';
    const Info = await InitInfoAPI1();
    // console.log(Info);
    if (Info === false) {
        console.log('Error: API1 No Info Returned');
        document.getElementById('API1_ItemValue').innerHTML = 'Error: No Info Returned from API1/Database<br>Check Dev Tools Console for more info';
        input['API1'] = false;
        return input;
    }

    // update API1 element
    const api1 = Object.keys(Info.APIs)[0];
    document.getElementById('API1_title').innerHTML = Info.APIs[api1];
    document.getElementById('API1_description').innerHTML = 'API ID: ' + api1;

    // update API1 location options
    html = '<option value="0">Please select</option>';
    length = Object.keys(Info[api1].locationOption).length;
    for (let i = 0; i < length; i++) {
        var key = Object.keys(Info[api1].locationOption[i])[0];
        var option = key;
        html += `<option value="${key}">${option}</option>`;
    }
    document.getElementById('API1_Location').innerHTML = html;

    // update API1 item options
    html = '<option value="0">Please select</option>';
    length = Object.keys(Info[api1].itemOption).length;
    for (let i = 0; i < length; i++) {
        var key = Object.keys(Info[api1].itemOption[i])[0];
        var option = Info[api1].itemOption[i][key];
        html += `<option value="${key}">${option}</option>`;
    }
    document.getElementById('API1_Item').innerHTML = html;

    console.log('initWebpageElementAPI1 done');
    input['API1'] = api1;
    return input;
}

async function initWebpageElementAPI2(input) {
    var html = '';
    const Info = await InitInfoAPI2();
    // console.log(Info);
    if (Info === false) {
        console.log('Error: API2 No Info Returned');
        document.getElementById('API2_ItemValue').innerHTML = 'Error: No Info Returned from API1/Database<br>Check Dev Tools Console for more info';
        input['API2'] = false;
        return input;
    }

    // update API2 element
    const api2 = Object.keys(Info.APIs)[1];
    document.getElementById('API2_title').innerHTML = Info.APIs[api2];
    document.getElementById('API2_description').innerHTML = 'API ID: ' + api2;

    // update API2 location options
    html = '<option value="0">Please select</option>';
    length = Object.keys(Info[api2].locationOption).length;
    for (let i = 0; i < length; i++) {
        var key = Object.keys(Info[api2].locationOption[i])[0];
        var option = Info[api2].locationOption[i][key];
        html += `<option value="${key}">${option}</option>`;
    }
    document.getElementById('API2_Location').innerHTML = html;

    // update API2 item options
    html = '<option value="0">Please select</option>';
    length = Object.keys(Info[api2].itemOption).length;
    for (let i = 0; i < length; i++) {
        var key = Object.keys(Info[api2].itemOption[i])[0];
        var option = Info[api2].itemOption[i][key];
        html += `<option value="${key}">${option}</option>`;
    }
    document.getElementById('API2_Item').innerHTML = html;

    console.log('initWebpageElementAPI2 done');
    input['API2'] = api2;
    return input;
}

async function initWebpageElementReader() {
    var options = await initInfoReader();
    var html = '<option value="0">None</option>';
    var length = options.length;
    for (let i = 0; i < length; i++) {
        // console.log(options[i]);
        var key = options[i].lang;
        var option = options[i].name;
        html += `<option value="${key}">${option}</option>`;
    }
    voices = options;
    // console.log(voices);
    document.getElementById('reader').innerHTML = html;
    console.log('initWebpageElementReader done');
}

function updateAPI1Element(value, unit, item) {
    var readText = '';
    var html = '<table>';
    var length1 = value.length;
    for (let i = 0; i < length1; i++) {
        var length2 = Object.keys(value[i]).length;
        var content = [];
        for (let j = 0; j < length2; j++) {
            var key1 = Object.keys(value[i])[j];
            var value1 = value[i][key1];
            // console.log(key1, value1);
            if (j !== 2) {
                content.push(value1);
            } else {
                var length3 = Object.keys(value1).length;
                for (let k = 0; k < length3; k++) {
                    var key2 = Object.keys(value1)[k];
                    var value2 = value1[key2];
                    // console.log(key2, value2);
                    content.push(value2);
                }
            }
        }
        console.log(content);
        if (item !== 'Wx') {
            content[3] = unit;
        }
        html += `<tr><td>${content[0]} - ${content[1]}</td><td>${content[2]} ${content[3]}</td></tr>`;
        if (i === 0) {
            readText = content[2] + ' ' + content[3];
        }
    }
    html += '</table>';
    // console.log(html);
    document.getElementById('API1_ItemValue').innerHTML = html;
    // document.getElementById('API1_ItemValue').style.fontSize = '30px';
    return readText;
}

function updateAPI2Element(value, unit) {
    var html = value + ' ' + unit;
    if (value < 0) {
        html = 'Data not available';
    }
    document.getElementById('API2_ItemValue').innerHTML = html;
    document.getElementById('API2_ItemValue').style.fontSize = '30px';
}

function findAndReturnVoice(lang, voices) {
    var length = voices.length;
    for (let i = 0; i < length; i++) {
        if (voices[i].lang === lang) {
            return voices[i];
        }
    }
    return false;
}

////////////////////////////////////////////////////////////////////////////////////////
// Element Modification
// https://www.w3schools.com/howto/howto_js_filter_dropdown.asp