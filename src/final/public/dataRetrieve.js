class DataRetrieve {
    constructor(api) {
        this.data = {
            'src sites': {
                'TWCWB_OpenData': 'https://opendata.cwb.gov.tw/dist/opendata-swagger.html#/',
                'TWCWB_Document': 'https://opendata.cwb.gov.tw/dataset/forecast?page=1',
            },
            'APIs': {
                'F-C0032-001': {
                    'description': 'Weather Forecast',
                    'updateFrequency': '6', // 6 hours
                    'locationLayer': 'city',
                    'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=',
                    'itemName': {
                        // 'ELEV'
                    }
                },
                // 'F-A0021-001': {
                //     'description': 'Tide Forecast',
                //     'updateFrequency': '24', // 24 hours
                //     'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-A0021-001?Authorization='
                // },
                // 'F-A0085-003': {
                //     'description': 'Health Weather Cold Injury',
                //     'updateFrequency': '6', // 6 hours
                //     'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-A0085-003?Authorization='
                // },
                'O-A0001-001': {
                    'description': 'Weather Observation',
                    'updateFrequency': '1', // 1 hour
                    'locationLayer': 'station',
                    'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=',
                    'itemName': {
                        'ELEV': 'Elevation',
                        'WDIR': 'Wind Direction',
                        'WDSD': 'Wind Speed',
                        'TEMP': 'Temperature',
                        'HUMD': 'Humidity',
                        'PRES': 'Pressure',
                        'H_24R': 'Cumulative Rainfall',
                        'H_FX': 'Maximum Wind Speed this hour',
                        'H_XD': 'Maximum Wind Direction this hour',
                        'H_FXT': 'Maximum Wind Time this hour',
                        'D_TX': 'Maximum Temperature today (°C)',
                        'D_TXT': 'Maximum Temperature Time today',
                        'D_TN': 'Minimum Temperature today (°C)',
                        'D_TNT': 'Minimum Temperature Time today',
                    }
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
            'ItemValue': {
            }
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
                console.log('Server/API down.');
                data = 'NA';
            }
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    extractLocation() {
        var location_data = this.data.rawData.records.location;
        var data_length = location_data.length;
        var location_name = [];

        switch (this.data.APIs[this.data.selectedAPI].locationLayer) {
            case 'city':
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
                    temp_obj[temp_name] = temp_id;
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

        switch (this.data.APIs[this.data.selectedAPI].locationLayer) {
            case 'city':
                break;
            case 'town':
                break;
            case 'station':
                for (let index = 0; index < itemData.length; index++) {
                    var temp_obj = {};
                    temp_obj[this.data.APIs[this.data.selectedAPI].itemName[itemData[index]]] = itemData[index];
                    option.push(temp_obj);
                }
                break;
            default:
                break;
        }

        this.data.ItemOption = option;
        return option;
    }

    generateItemValue() {
        switch (this.data.APIs[this.data.selectedAPI].locationLayer) {
            case 'city':
                break;
            case 'town':
                break;
            case 'station':
                break;
            default:
                break;
        }
    }

};

export default async function DRroutine(APItype) {
    // var APItype = 'O-A0001-001';
    var APItype = 'F-C0032-001';
    var dr = new DataRetrieve(APItype);
    var data = await dr.requestAPI(dr.data.Token['User01']);
    console.log(dr.data.fullLink)
    console.log(data);
    dr.extractLocation();
    console.log(dr.data.Location);
    dr.generateLocationOption();
    console.log(dr.data.LocationOption);
    dr.extractItem();
    console.log(dr.data.Item);
    dr.generateItemOption();
    console.log(dr.data.ItemOption);
}
