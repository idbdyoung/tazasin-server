import cors, { CorsOptions } from 'cors';

const whiteList = [process.env.CLIENT_URL, 'http://localhost:3000', 'https://idbdyoung.com'];

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    console.log(origin, whiteList[0]);
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
