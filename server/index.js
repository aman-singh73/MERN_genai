// import express from 'express';
// import * as dotenv from 'dotenv';
// import cors from 'cors';

// import connectDB from './database/connect.js';
// import postRoute from './routes/postRoute.js';
// import dalle_connect from './routes/dalle_connect.js';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ "limit": '50mb' }));

// app.use('/api/v1/post', postRoute);
// app.use('/api/v1/dalle', dalle_connect);

// app.get('/', async (req, res) => {
//   res.status(200).json({
//     message: 'Hello from DALLE!',
//   });
// });

// const startServer = async () => {
//   try {
//     connectDB(process.env.DB_NAME);
//     app.listen(8080, () => console.log('Server started on port 8080'));
//   } catch (error) {
//     console.log(error);
//   }
// };

// startServer();




import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import dalle_connect from './routes/dalle_connect.js';
import postRoute from './routes/postRoute.js'; // Ensure this import matches the actual file name

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/dalle', dalle_connect);
app.use('/api/v1/post', postRoute); // Add this to route requests to postRoute

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from DALLE!',
  });
});

const startServer = () => {
  app.listen(8080, () => console.log('Server started on port 8080'));
};

startServer();
