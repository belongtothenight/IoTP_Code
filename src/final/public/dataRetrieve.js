import { FirebaseRealtimeDatabase, restructureDatabase, writeDatabase, readDatabase, } from './database.js';

class DataRetrieve {
    // class object to store all data and functions related to data retrieve
    constructor(api) {
        this.data = {
            'src sites': {
                'TWCWB_OpenData': {
                    'name': '中央氣象局開放資料平台之資料擷取API',
                    'link': 'https://opendata.cwb.gov.tw/dist/opendata-swagger.html#/',
                },
                'TWCWB_Document': {
                    'name': '氣象資料開放平台',
                    'link': 'https://opendata.cwb.gov.tw/dataset/forecast',
                },
                'TWCWB_WordDict': {
                    'name': '氣象資料開放平台-中英文對照表',
                    'link': 'https://www.cwb.gov.tw/V8/C/K/bilingual_glossary.html#/',
                },
            },
            'APIs': {
                // 'locationLyaer' is used to reduce replicated code, but if every API has totally different JSON structure, this is no use and can be abandoned.
                'F-C0032-001': {
                    'description': 'Weather Forecast',
                    'updateInterval': '6', // 6 hours
                    'locationLayer': 'city',
                    'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=',
                    'itemDict': {
                        'Wx': {
                            'name': 'Weather Condition',
                            'unit': '',
                        },
                        'MaxT': {
                            'name': 'Maximum Temperature',
                            'unit': '°C',
                        },
                        'MinT': {
                            'name': 'Minimum Temperature',
                            'unit': '°C',
                        },
                        'CI': {
                            'name': 'Comfort Level',
                            'unit': '',
                        },
                        'PoP': {
                            'name': 'Probability of Preciptation',
                            'unit': '%',
                        },
                    }
                },
                // 'F-A0021-001': {
                //     'description': 'Tide Forecast',
                //     'updateInterval': '24', // 24 hours
                //     'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-A0021-001?Authorization='
                // },
                // 'F-A0085-003': {
                //     'description': 'Health Weather Cold Injury',
                //     'updateInterval': '6', // 6 hours
                //     'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-A0085-003?Authorization='
                // },
                'O-A0001-001': {
                    'description': 'Weather Observation',
                    'updateInterval': '1', // 1 hour // regularly down at 11 minut each hour
                    'locationLayer': 'station',
                    'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=',
                    'itemDict': {
                        'ELEV': {
                            'name': 'Elevation',
                            'unit': 'm',
                        },
                        'WDIR': {
                            'name': 'Wind Direction',
                            'unit': 'degree',
                        },
                        'WDSD': {
                            'name': 'Wind Speed',
                            'unit': 'm/s',
                        },
                        'TEMP': {
                            'name': 'Temperature',
                            'unit': '°C',
                        },
                        'HUMD': {
                            'name': 'Humidity',
                            'unit': '%',
                        },
                        'PRES': {
                            'name': 'Pressure',
                            'unit': 'hpa',
                        },
                        'H_24R': {
                            'name': 'Cumulative Rainfall',
                            'unit': 'mm',
                        },
                        'H_FX': {
                            'name': 'Maximum Wind Speed this hour',
                            'unit': 'm/s',
                        },
                        'H_XD': {
                            'name': 'Maximum Wind Direction this hour',
                            'unit': 'degree',
                        },
                        'H_FXT': {
                            'name': 'Maximum Wind Time this hour',
                            'unit': '',
                        },
                        'D_TX': {
                            'name': 'Maximum Temperature today',
                            'unit': '°C',
                        },
                        'D_TXT': {
                            'name': 'Maximum Temperature Time today',
                            'unit': '',
                        },
                        'D_TN': {
                            'name': 'Minimum Temperature today',
                            'unit': '°C',
                        },
                        'D_TNT': {
                            'name': 'Minimum Temperature Time today',
                            'unit': '',
                        },
                        'Weather': {
                            'name': 'Weather',
                            'unit': '',
                        }
                    },
                },
                // more can be added...
            },
            'Token': {
                'User01': 'CWB-8523DB1B-D613-401B-849E-BD0A19FAB9E6',
            },
            'fullLink': '',
            'selectedAPI': api,
            'rawData': {
            },
            'Location': {

            },
            'LocationOption': {
            },
            'Item': {
            },
            'ItemOption': {
            },
        }
    }
    // add corresponding subsctructor(options5) of each API?
    async requestAPI(token) {
        try {
            const fullLink = this.data.APIs[this.data.selectedAPI].link + token;
            this.data.fullLink = fullLink;
            const response = await fetch(fullLink, { method: 'GET' });
            const data = await response.json();
            this.data.rawData = data;
            if (data.records.location.length === 0) {
                console.log('API ID ', this.data.selectedAPI, ' Server/API down.');
                data = 'NA';
            }
            // console.log(data);
            return data;
        } catch (err) {
            // console.log(err);
        }
    }

    extractLocation() {
        var location_data = this.data.rawData.records.location;
        var data_length = location_data.length;
        var location_name = [];

        // console.log('locationLayer: ', this.data.APIs[this.data.selectedAPI].locationLayer);
        switch (this.data.APIs[this.data.selectedAPI].locationLayer) {
            case 'city':
                // console.log('city');
                for (let index = 0; index < data_length; index++) {
                    var temp_locationName = location_data[index].locationName;
                    location_name[index] = {
                        location: temp_locationName,
                    };
                }
                break;
            case 'town':
                break;
            case 'station':
                // console.log('station');
                for (let index = 0; index < data_length; index++) {
                    var temp_locationName = location_data[index].locationName;
                    var temp_cityName = location_data[index].parameter[0].parameterValue;
                    var temp_townName = location_data[index].parameter[2].parameterValue;
                    var temp_stationId = location_data[index].stationId;
                    location_name[index] = {
                        city: temp_cityName,
                        town: temp_townName,
                        location: temp_locationName,
                        id: temp_stationId
                    };
                }
                break;
            default:
                location_name = "NA";
        }
        this.data.Location = location_name;
    }

    generateLocationOption() {
        function compare(a, b) {
            var keya = Object.keys(a)[0];
            var keyb = Object.keys(b)[0];
            // node.warn(keya);
            // node.warn(keya);
            if (keya < keyb) {
                return -1;
            } else if (keya > keyb) {
                return 1;
            } else {
                return 0;
            }
        }

        var data = this.data.Location;
        var option = [];

        switch (this.data.APIs[this.data.selectedAPI].locationLayer) {
            case 'city':
                for (let index = 0; index < data.length; index++) {
                    var temp_location = data[index].location;
                    var temp_obj = {};
                    temp_obj[temp_location] = temp_location;
                    option[index] = temp_obj;
                }
            case 'town':
                break;
            case 'station':
                for (let index = 0; index < data.length; index++) {
                    var temp_id = data[index].id;
                    var temp_location = data[index].location;
                    var temp_name = data[index].city + '/' + data[index].town + '/' + data[index].location;
                    var temp_obj = {};
                    temp_obj[temp_id] = temp_name;
                    option[index] = temp_obj;
                }
                break;
            default:
                break;
        }
        option = option.sort(compare);
        this.data.LocationOption = option;
        return option;
    }

    extractItem() {
        switch (this.data.APIs[this.data.selectedAPI].locationLayer) {
            // use first set of data to get items
            case 'city':
                var weatherElementData = this.data.rawData.records.location[0].weatherElement;
                var weatherElementLength = weatherElementData.length;
                var weatherElementName = [];

                for (let index = 0; index < weatherElementLength; index++) {
                    weatherElementName.push(weatherElementData[index].elementName);
                }

                this.data.Item = weatherElementName;
                return weatherElementName;
                break;
            case 'town':
                break;
            case 'station':
                var weatherElementData = this.data.rawData.records.location[0].weatherElement;
                var weatherElementLength = weatherElementData.length;
                var weatherElementName = [];

                for (let index = 0; index < weatherElementLength; index++) {
                    weatherElementName[index] = weatherElementData[index].elementName;
                }

                this.data.Item = weatherElementName;
                return weatherElementName;
                break;
            default:
                break;
        }
    }

    generateItemOption() {
        var itemData = this.data.Item;
        var option = [];

        for (let index = 0; index < itemData.length; index++) {
            var temp_obj = {};
            var name = this.data.APIs[this.data.selectedAPI].itemDict[itemData[index]].name;
            temp_obj[itemData[index]] = name;
            option.push(temp_obj);
        }

        this.data.ItemOption = option;
        return option;
    }

    extractItemValue(location, itemName) {
        var locationData = this.data.rawData.records.location;
        // console.log(locationData)

        // switch condition here needs to be APIs
        switch (this.data.selectedAPI) {
            case 'F-C0032-001':
                // look for same location
                for (let i = 0; i < locationData.length; i++) {
                    if (locationData[i].locationName === location) {
                        // look for same weatherElement
                        const weatherElementData = locationData[i].weatherElement
                        for (let j = 0; j < weatherElementData.length; j++) {
                            if (weatherElementData[j].elementName === itemName) {
                                return weatherElementData[j].time;
                            }
                        }
                    }
                }
                break;
            case 'O-A0001-001':
                // look for same location (stationId)
                for (let i = 0; i < locationData.length; i++) {
                    if (locationData[i].stationId === location) {
                        // look for same weatherElement
                        const weatherElementData = locationData[i].weatherElement;
                        for (let j = 0; j < weatherElementData.length; j++) {
                            if (weatherElementData[j].elementName === itemName) {
                                return weatherElementData[j].elementValue
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
    }

};

async function DRroutine(APItype) {
    // complete routine to retrieve data, useful for testing functions
    var APItype = 'O-A0001-001';
    // var APItype = API_ID;
    var dr = new DataRetrieve(APItype);
    var data = await dr.requestAPI(dr.data.Token['User01']);
    // console.log(dr.data.fullLink)
    // console.log(data);
    dr.extractLocation();
    // console.log(dr.data.Location);
    dr.generateLocationOption();
    // console.log(dr.data.LocationOption);
    dr.extractItem();
    // console.log(dr.data.Item);
    dr.generateItemOption();
    // console.log(dr.data.ItemOption);
    // var value = dr.extractItemValue('C0A560', 'ELEV');
    // var value = dr.extractItemValue('嘉義縣', 'Wx');
    // console.log(value)
}

function InitInfoSources() {
    var dr = new DataRetrieve();
    return dr.data['src sites'];
}

async function InitInfoAPI1() {
    var APIs = {};
    const API_ID = 'F-C0032-001';
    var dr = new DataRetrieve(API_ID);
    APIs['APIs'] = {};
    APIs[API_ID] = {};

    // get API into
    var APItypes = Object.keys(dr.data.APIs);
    for (let index = 0; index < APItypes.length; index++) {
        APIs.APIs[APItypes[index]] = dr.data.APIs[APItypes[index]].description;
    }

    // determine to store or retrieve data in realtime database, or retrieve from API
    var API_retrieveFromDatabase = false; // default
    var API_retrieveFromAPI = false; //
    var API1_data = await readDatabase('API1/UpdateTime');
    try {
        var API1_dataLength = API1_data.length;
    } catch (err) {
        console.log('API1_data is not an array');
    }

    // if database content is weird, retrieve from API
    if (API1_dataLength <= 2) {
        API_retrieveFromAPI = true;
        API_retrieveFromDatabase = false;
    } else {
        // if database content is outdated, retrieve from API
        var currentTime = new Date(Date.now());
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const API1_dataTime = new Date(API1_data);
        const API1_dataHour = API1_dataTime.getHours();
        const API1_dataMinute = API1_dataTime.getMinutes();
        const timeDifference = (currentHour - API1_dataHour) * 60 + (currentMinute - API1_dataMinute);
        // 1.1: extra time to prevent updating database while API is down.
        if (timeDifference > dr.data.APIs[API_ID].updateInterval * 60 * 1.1) {
            API_retrieveFromAPI = true;
            API_retrieveFromDatabase = false;
        } else {
            API_retrieveFromAPI = false;
            API_retrieveFromDatabase = true;
        }
    }

    // retrieving
    if (API_retrieveFromDatabase) {
        // retrieveFromDatabase
        var API1_data = await readDatabase('API1/RawData');
        // console.log(API1_data);
        if (API1_data === false) {
            API_retrieveFromDatabase = false;
        } else {
            dr.data.rawData = API1_data;
        }
    }
    if (API_retrieveFromAPI) {
        try {
            // get API1 data
            // store data in mem
            await dr.requestAPI(dr.data.Token['User01']);
            // store data in database
            const writeData = {};
            writeData['RawData'] = dr.data.rawData;
            writeData['UpdateTime'] = (new Date(Date.now())).toString();
            console.log('API1 data updated at ' + writeData['UpdateTime'])
            // console.log('Uploaded data', writeData)
            writeDatabase('API1', writeData);
        } catch (error) {
            // if API is down, return false
            console.log(error)
            API_retrieveFromAPI = false;
            return false;
        }
    }
    console.log('API1/DB status: ' + API_retrieveFromAPI + ' / ' + API_retrieveFromDatabase);

    // get API1 location option
    dr.extractLocation();
    dr.generateLocationOption();
    // get API1 item option
    dr.extractItem();
    dr.generateItemOption();
    // set API1 location option
    // console.log(dr.data);
    APIs[API_ID]['locationOption'] = dr.data.LocationOption;
    // set API1 item option
    APIs[API_ID]['itemOption'] = dr.data.ItemOption;

    return APIs;
}

async function InitInfoAPI2() {
    var APIs = {};
    const API_ID = 'O-A0001-001';
    var dr = new DataRetrieve(API_ID);
    APIs['APIs'] = {};
    APIs[API_ID] = {};

    // get API into
    var APItypes = Object.keys(dr.data.APIs);
    for (let index = 0; index < APItypes.length; index++) {
        APIs.APIs[APItypes[index]] = dr.data.APIs[APItypes[index]].description;
    }

    // determine to store or retrieve data in realtime database, or retrieve from API
    var API_retrieveFromDatabase = false; // default
    var API_retrieveFromAPI = false; //
    var API2_data = await readDatabase('API2/UpdateTime');
    try {
        var API2_dataLength = API2_data.length;
    } catch (err) {
        console.log('API2_data is not an array');
    }

    // if database content is weird, retrieve from API
    if (API2_dataLength <= 2) {
        API_retrieveFromAPI = true;
        API_retrieveFromDatabase = false;
    } else {
        // if database content is outdated, retrieve from API
        var currentTime = new Date(Date.now());
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const API2_dataTime = new Date(API2_data);
        const API2_dataHour = API2_dataTime.getHours();
        const API2_dataMinute = API2_dataTime.getMinutes();
        const timeDifference = (currentHour - API2_dataHour) * 60 + (currentMinute - API2_dataMinute);
        // 1.1: extra time to prevent updating database while API is down.
        if (timeDifference > dr.data.APIs[API_ID].updateInterval * 60 * 1.1) {
            API_retrieveFromAPI = true;
            API_retrieveFromDatabase = false;
        } else {
            API_retrieveFromAPI = false;
            API_retrieveFromDatabase = true;
        }
    }

    // retrieving
    if (API_retrieveFromDatabase) {
        // retrieveFromDatabase
        var API2_data = await readDatabase('API2/RawData');
        // console.log(API2_data);
        if (API2_data === false) {
            API_retrieveFromDatabase = false;
        } else {
            dr.data.rawData = API2_data;
        }
    }
    if (API_retrieveFromAPI) {
        try {
            // get API2 data
            await dr.requestAPI(dr.data.Token['User01']);
            // store data in database
            const writeData = {};
            writeData['RawData'] = dr.data.rawData;
            writeData['UpdateTime'] = (new Date(Date.now())).toString();
            console.log('API2 data updated at ' + writeData['UpdateTime'])
            // console.log('Uploaded data', writeData)
            writeDatabase('API2', writeData);
        } catch (error) {
            // if API is down, return false
            console.log(error)
            API_retrieveFromAPI = false;
            return false;
        }
    }
    console.log('API2/DB status: ' + API_retrieveFromAPI + ' / ' + API_retrieveFromDatabase);

    // get API2 location option
    dr.extractLocation();
    dr.generateLocationOption();
    // get API2 item option
    dr.extractItem();
    dr.generateItemOption();
    // set API2 location option
    APIs[API_ID]['locationOption'] = dr.data.LocationOption;
    // set API2 item option
    APIs[API_ID]['itemOption'] = dr.data.ItemOption;

    return APIs;

}

async function DRsingleRun(APItype, location, item) {
    var dr = new DataRetrieve(APItype);
    var _ = await dr.requestAPI(dr.data.Token['User01']);
    var value = dr.extractItemValue(location, item);
    return value;
}

export { DRroutine, InitInfoSources, InitInfoAPI1, InitInfoAPI2, DRsingleRun, DataRetrieve }