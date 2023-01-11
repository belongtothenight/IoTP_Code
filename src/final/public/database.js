// referrence: https://firebase.google.com/docs/database/web/read-and-write
// referrence: https://firebase.google.com/docs/database/web/structure-data?authuser=0
// Import the functions you need from the SDKs you need

class FirebaseRealtimeDatabase {
    /*
    on(): read everything

    set(): sets the value of a specified path in the database.

    update(): updates the values of one or more fields in a specified path of the database.

    push(): creates a new child node at the end of the specified path in the database, and assigns a unique key to the new node.

    remove(): removes the specified path from the database.

    once(): retrieves the value of a specified path in the database only once, and then stops listening.
    */
    constructor() {
        this.emptyStructure = {
            'API1': {
                'RawData': "NA", // raw data from api
                'UpdateTime': "NA", // Date string
            },
            'API2': {
                'RawData': "NA", // raw data from api
                'UpdateTime': "NA", // Date string
            },
        };
        this.keys = Object.keys(this.emptyStructure);
    }

    async retrieveStructure() {
        var data;
        await firebase.database().ref('/').once('value').then(function (snapshot) {
            data = snapshot.val();
        });
        return data;
    }

    async retrieveStructureElement(key) {
        var data;
        await firebase.database().ref('/' + key).once('value').then(function (snapshot) {
            data = snapshot.val();
        });
        return data;
    }

    refreshStructure() {
        firebase.database().ref('/').set(this.emptyStructure);
    }

    updateStructureElement(key, data) {
        firebase.database().ref('/' + key).set(data);
    }
}

async function restructureDatabase() {
    try {
        let db = new FirebaseRealtimeDatabase();
        const structure = await db.retrieveStructure();
        console.log(structure);
        const keys = Object.keys(structure);
        console.log(keys);
        if (keys !== db.keys) {
            db.refreshStructure();
        }
    } catch (error) {
        console.log(error);
        console.log('Unable to connect to database. Please check your internet connection.');
    }
}

async function writeDatabase(key, data) {
    try {
        let db = new FirebaseRealtimeDatabase();
        db.updateStructureElement(key, data);
    } catch (error) {
        console.log(error);
        console.log('Unable to connect to database. Please check your internet connection.');
    }
}

async function readDatabase(key) {
    try {
        let db = new FirebaseRealtimeDatabase();
        const data = await db.retrieveStructureElement(key);
        return data;
    } catch (error) {
        console.log(error);
        console.log('Unable to connect to database. Please check your internet connection.');
        return false;
    }
}

export {
    FirebaseRealtimeDatabase, restructureDatabase, writeDatabase, readDatabase,
}