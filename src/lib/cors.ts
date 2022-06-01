import cors, { CorsOptions } from 'cors';

const whiteList = [process.env.CLIENT_URL!];

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    console.log(whiteList[0], origin);
    if (whiteList.indexOf(origin!) !== -1) {
      console.log(whiteList[0]);
      cb(null, true);
    } else {
      cb(new Error('Not allowed origin!'));
    }
  },
  credentials: true,
};
const Cors = cors(corsOptions);

export default Cors;
