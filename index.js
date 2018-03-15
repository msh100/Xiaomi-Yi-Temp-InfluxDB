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

var temperatureChange = function (value, id) {
    log.debug('Writing temperature to Influx:', value, deviceName(id));

    InfluxClient.write('Temperature')
        .tag({
            device: deviceName(id)
        })
        .field({
            celcius: value
        })
        .then(() => log.debug('Write point success'))
        .catch(log.error);
}

var humidityChange = function (value, id) {
    log.debug('Writing humidity to Influx:', value, deviceName(id));

    InfluxClient.write('Humidity')
        .tag({
            device: deviceName(id)
        })
        .field({
            percent: value
        })
        .then(() => log.debug('Write point success'))
        .catch(log.error);

}

var batteryChange = function (value, id) {
    log.debug('Write battery state to Influx:', value, deviceName(id));

    InfluxClient.write('Battery')
        .tag({
            device: deviceName(id)
        })
        .field({
            percent: value
        })
        .then(() => log.debug('Write point success'))
        .catch(log.error);
}

Scanner.on('temperatureChange', temperatureChange);
Scanner.on('humidityChange', humidityChange);
Scanner.on('batteryChange', batteryChange);
