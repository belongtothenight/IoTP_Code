import { DRroutine, InitInfo, DRsingleRun, DataRetrieve } from './dataRetrieve.js';

var APIs = {}; // store API names
var API1_flag = { location: false, item: false };
var API2_flag = { location: false, item: false };

document.addEventListener('DOMContentLoaded', async function () {
    // initFirebase();
    APIs = await initWebpageElement();
    // console.log(APIs);
    // var APItype = APIs.API1;
    // var APItype = APIs.API2;
    // DRroutine(APItype);
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
        var location = document.getElementById('API1_Location').value;
        var item = document.getElementById('API1_Item').value;
        var returnValue = await DRsingleRun(APIs.API1, location, item);
        console.log(returnValue);
        updateAPI1Element(returnValue);
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
        var location = document.getElementById('API1_Location').value;
        var item = document.getElementById('API1_Item').value;
        var returnValue = await DRsingleRun(APIs.API1, location, item);
        console.log(returnValue);
        updateAPI1Element(returnValue);
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
    }
});

// change https://www.w3schools.com/howto/howto_js_filter_dropdown.asp

function initFirebase() {
    const loadEl = document.querySelector('#load');
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
        // let app = firebase.app();
        // let features = [
        //     'auth',
        //     'database',
        //     'firestore',
        //     'functions',
        //     'messaging',
        //     'storage',
        //     'analytics',
        //     'remoteConfig',
        //     'performance',
        // ].filter(feature => typeof app[feature] === 'function');
        // loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
        loadEl.textContent = 'Hello from Firebase!';
    } catch (e) {
        console.error(e);
        loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
    }
    // console.log('Hello from Firebase!');
}

async function initWebpageElement() {
    var html = '';
    const Info = await InitInfo();
    // console.log(Info);

    // update APIs title
    const api1 = Object.keys(Info.APIs)[0];
    const api2 = Object.keys(Info.APIs)[1];
    document.getElementById('API1_title').innerHTML = Info.APIs[api1];
    document.getElementById('API2_title').innerHTML = Info.APIs[api2];

    // update APIs description
    document.getElementById('API1_description').innerHTML = 'API ID: ' + api1;
    document.getElementById('API2_description').innerHTML = 'API ID: ' + api2;

    // update sources
    html = '';
    html = document.getElementById('source').innerHTML;
    let keys = Object.keys(Info.source);
    let length = keys.length;
    for (let i = 0; i < length; i++) {
        var link = '<a href="' + Info.source[keys[i]].link + ' target="_blank">' + Info.source[keys[i]].name + '</a>';
        html += `${link}<br>`;
    }
    document.getElementById('source').innerHTML = html;

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

    console.log('initWebpageElement done');
    return { 'API1': api1, 'API2': api2 };
}

function updateAPI1Element(input) {

}

function updateAPI2Element(value, unit) {
    var html = value + ' ' + unit;
    document.getElementById('API2_ItemValue').innerHTML = html;
}