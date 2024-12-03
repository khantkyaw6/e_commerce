const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const errorMiddleware = require('./src/middlewares/errorMiddleware');
const router = require('./src/routes/index'); // Version Routes
const swaggerDocument = YAML.load('./src/views/api.yaml');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './src/locales/{{lng}}/translation.json',
    },
  });

const app = express();

const corsOptions = {
  origin: '*',
};
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Set Rate Limit
const limiter = rateLimit({
  windowMs: 7 * 60 * 1000, // 7 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(cors(corsOptions));
app.use(middleware.handle(i18next));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(limiter);

var options = {
  customCss: '.swagger-ui .topbar { display: none }',
};

app.use('/api', router);
app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, options),
);

app.use(errorMiddleware);

module.exports = app;
