const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.safeLoad(fs.readFileSync(__dirname + '/config.yml', 'utf8'));

const Influx = require('influxdb-nodejs');
const InfluxClient = new Influx(config.InfluxDB);
const Log = require('log'),
      log = new Log('debug');
const { Scanner } = require('homebridge-mi-hygrothermograph/lib/scanner');

XiScanner = new Scanner(log);
XiScanner.start();

var deviceName = function (id) {
    if (typeof config.Devices[id] === 'undefined') return id;
    else return config.Devices[id];
}

var writeDataPoint = function (type, value, unit, id) {
    log.debug('Writing', type.toLowerCase(), 'to Influx:', value, deviceName(id));

    data = tag = {};
    data[unit] = value;
    tag['device'] = deviceName(id);

    if (config.PostUnknown || tag['device'] !== id) {
        InfluxClient.write(type)
            .tag(tag)
            .field(data)
            .then(() => log.debug('Write point success'))
            .catch(log.error);
    } else {
        log.debug('Not posting %s information as device is unknown.', id);
    }
}

XiScanner.on('temperatureChange', function (value, id) {
    writeDataPoint('Temperature', value, 'celcius', id);
});

XiScanner.on('humidityChange', function (value, id) {
    writeDataPoint('Humidity', value, 'percent', id);
});

XiScanner.on('batteryChange', function (value, id) {
    writeDataPoint('Battery', value, 'percent', id);
});
