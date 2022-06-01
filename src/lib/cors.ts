import cors, { CorsOptions } from 'cors';

const whiteList = [process.env.CLIENT_URL, 'http://localhost:3000'];

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    console.log(process.env.CLIENT_URL, origin);
    if (whiteList.indexOf(origin!) !== -1) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed origin!'));
    }
  },
  // credentials: true,
};
const Cors = cors(corsOptions);

export default Cors;
