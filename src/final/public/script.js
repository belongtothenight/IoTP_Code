import DRroutine from './dataRetrieve.js';

document.addEventListener('DOMContentLoaded', function () {
    initFirebase();
    var APItype = 'O-A0001-001';
    var APItype = 'F-C0032-001';
    DRroutine(APItype);
});

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