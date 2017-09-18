const Influx = require('influx');
const settings = require('./settings.json');
const influx = new Influx.InfluxDB({
  host: settings.influx_host,
  database: 'discord',
  schema: [
    {
      measurement: 'statistics',
      fields: {
        count: Influx.FieldType.INTEGER
      },
      tags: [
        'type'
      ]
    }
  ]
});
module.exports = influx;
