# Xiaomi Yi Hygrothermograph InfluxDB Processor

This is a simple utility to listen for BLE broadcasts from Xiaomi hygrothermograph sensors (as pictured below) and push their results to InfluxDB.

![Xiaomi Yi Hygrothermograph](https://github.com/hannseman/homebridge-mi-hygrothermograph/blob/bb2aeeb42cc3cb5f05a44bbab134596eaf884ded/images/hygrothermograph.png?raw=true)


## Configuration

`config.example.json` contains my own (@msh100) `config.json`.

The `config.json` file consists of a few keys:

Key           | Value
--------------|----------
`InfluxDB`    | The URL to your InfluxDB database.
`Devices`     | An array of device IDs with human readable names.
`PostUnknown` | (bool) Should metrics be posted if they're not defined in `Devices`?


