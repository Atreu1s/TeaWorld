import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js'; 
import adminRoutes from './routes/admin.js';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // разрешает запросы с любого порта фронт (5173)->(5000)->(27017)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB подключена');
  })
  .catch((err) => {
    console.error('Ошибка подключения:', err);
  });

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер работает' 
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    message: 'Маршрут не найден' 
  });
});

  process.on('SIGINT', async () => {
  console.log('Завершение работы сервера');
  await mongoose.connection.close();
  console.log('MongoDB отключена');
  process.exit(0);
});


app.listen(PORT, () => {
  console.log(`Бэкенд запущен на http://localhost:${PORT}`);
});

app.use('/api/admin', adminRoutes);