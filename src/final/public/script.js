import { DRroutine, InitInfo, DRsingleRun, DataRetrieve } from './dataRetrieve.js';

var API1_flag = { location: false, item: false };

document.addEventListener('DOMContentLoaded', function () {
    // initFirebase();
    initWebpageElement();

    var APItype = 'O-A0001-001';
    // var APItype = 'F-C0032-001';
    DRroutine(APItype);
});

document.getElementById('API1_Location').addEventListener('change', async function () {
    API1_flag.location = true;
    var value = await DRsingleRun('O-A0001-001', 'C0A560', 'ELEV');
    // var value = await DRsingleRun('F-C0032-001', '嘉義縣', 'Wx');
    console.log(value);
});

document.getElementById('API1_Item').addEventListener('change', async function () {
    API1_flag.item = true;
    var value = await DRsingleRun('O-A0001-001', 'C0A560', 'ELEV');
    // var value = await DRsingleRun('F-C0032-001', '嘉義縣', 'Wx');
    console.log(value);
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
    console.log(Info);

    // update APIs title
    const api1 = Object.keys(Info.APIs)[0];
    const api2 = Object.keys(Info.APIs)[1];
    document.getElementById('API1_title').innerHTML = Info.APIs[api1];
    document.getElementById('API2_title').innerHTML = Info.APIs[api2];

    // update APIs description
    document.getElementById('API1_description').innerHTML = api1;
    document.getElementById('API2_description').innerHTML = api2;

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
        html += `<option value="${i + 1}">${option}</option>`;
    }
    document.getElementById('API1_Location').innerHTML = html;

    // update API1 item options
    html = '<option value="0">Please select</option>';
    length = Object.keys(Info[api1].itemOption).length;
    for (let i = 0; i < length; i++) {
        var key = Object.keys(Info[api1].itemOption[i])[0];
        var option = Info[api1].itemOption[i][key];
        html += `<option value="${i + 1}">${option}</option>`;
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
}