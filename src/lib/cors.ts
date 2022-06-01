import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    if ('http://13.125.253.92' === origin!) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed origin!'));
    }
  },
  credentials: true,
};
const Cors = cors(corsOptions);

export default Cors;
