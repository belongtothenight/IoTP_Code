export default class DataRetrieve {
    constructor() {
        const data = {
            'src sites': {
                'TWCWB_OpenData': 'https://opendata.cwb.gov.tw/dist/opendata-swagger.html#/',
                'TWCWB_Document': 'https://opendata.cwb.gov.tw/dataset/forecast?page=1',
            },
            'APIs': {
                'Weather Forecast': {
                    'updateFrequency': '6', // 6 hours
                    'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization='
                },
                'Tide Forecast': {
                    'updateFrequency': '24', // 24 hours
                    'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-A0021-001?Authorization='
                },
                'Health Weather Cold Injury': {
                    'updateFrequency': '6', // 6 hours
                    'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-A0085-003?Authorization='
                },
                'Weather Observation': {
                    'updateFrequency': '1', // 1 hour
                    'link': 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization='
                },
                // more can be added...
            },
            'Token': {
                'User01': 'CWB-8523DB1B-D613-401B-849E-BD0A19FAB9E6',
            }
        }
    }

    _requestAPI() {
        console.log('requestAPI');
    }

};