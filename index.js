const yaml = require('js-yaml');
const fs = require('fs');

var config = yaml.safeLoad(fs.readFileSync(__dirname + '/config.yml', 'utf8'));

const Influx = require('influxdb-nodejs');
const InfluxClient = new Influx(config.InfluxDB);
const Log = require('log'),
      log = new Log('debug');
const Scanner = require('homebridge-mi-hygrothermograph/lib/scanner');

Scanner.start();

var deviceName = function (id) {
    if (typeof config.Devices[id] === 'undefined') {
        return id;
    }
    else {
        return config.Devices[id];
    }
}

var writeDataPoint = function (type, value, unit, id) {
    log.debug('Writing', type.toLowerCase(), 'to Influx:', value, deviceName(id));

    data = {};
    data[unit] = value;

    InfluxClient.write(type)
        .tag({
            device: deviceName(id)
        })
        .field(data)
        .then(() => log.debug('Write point success'))
        .catch(log.error);
}

var temperatureChange = function (value, id) {
    writeDataPoint('Temperature', value, 'celcius', id);
}

var humidityChange = function (value, id) {
    writeDataPoint('Humidity', value, 'percent', id);
}

var batteryChange = function (value, id) {
    writeDataPoint('Battery', value, 'percent', id);
}

Scanner.on('temperatureChange', temperatureChange);
Scanner.on('humidityChange', humidityChange);
Scanner.on('batteryChange', batteryChange);
