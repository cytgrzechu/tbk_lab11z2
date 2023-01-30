const express = require('express');
const Prometheus = require('prom-client')
const app = express();
const register = new Prometheus.Registry();
const metricsInterval = Prometheus.collectDefaultMetrics()

Prometheus.collectDefaultMetrics({register});
var i = 0;

const checkouts = new Prometheus.Counter({
    name: 'counter',
    help: 'Total number of sum requests',
    labelNames: ['i']
});

const httpRequestTimer = new Prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] 
});

register.registerMetric(checkouts);
register.registerMetric(httpRequestTimer);

app.listen(8050, '0.0.0.0', () => {
    console.log('Application listening at 0.0.0.0:8050');
})

app.get('/', (req, res) => {
    const end = httpRequestTimer.startTimer();
    const route = req.route.path;

    res.send('<a href="/add/10/77">Dodaj 10 i 77</a><br>');

    end({ route, code: res.statusCode, method: req.method });
});

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
})

app.get('/add/:x/:y', (req, res) => {
    const end = httpRequestTimer.startTimer();
    const route = req.route.path;
    let result = (parseInt(req.params['x']) + parseInt(req.params['y'])).toString();
    checkouts.inc({
        i: i+1
    })
    res.send(result);
    end({ route, code: res.statusCode, method: req.method });
});

