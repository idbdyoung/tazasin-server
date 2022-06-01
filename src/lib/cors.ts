import cors, { CorsOptions } from 'cors';

const whiteList = [process.env.CLIENT_URL];

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    if (whiteList.indexOf(origin!) !== -1) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed origin!'));
    }
  },
  credentials: true,
};
const Cors = cors(corsOptions);

export default Cors;
