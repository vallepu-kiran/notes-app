# Notes App - Separate Frontend & Backend

A full-stack notes application with React frontend and Express backend, using TypeORM and PostgreSQL.

## 🏗 Project Structure


notes-app/
├── frontend/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/           # Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── entities/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
└── README.md


## 🚀 Setup Instructions

### 1. Create Project Structure
\`\`\`bash
mkdir notes-app
cd notes-app
mkdir frontend backend
\`\`\`

### 2. Backend Setup (Express)
\`\`\`bash
cd backend
npm init -y
npm install express cors helmet morgan bcryptjs jsonwebtoken typeorm pg reflect-metadata dotenv
npm install @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken typescript ts-node nodemon --save-dev
\`\`\`

### 3. Frontend Setup (React)
\`\`\`bash
cd ../frontend
npx create-react-app . --template typescript
npm install axios react-router-dom @types/react-router-dom lucide-react recharts
npm install -D tailwindcss postcss autoprefixer @types/recharts
npx tailwindcss init -p
\`\`\`

### 4. Database Setup
\`\`\`sql
CREATE DATABASE notes_app;
\`\`\`

### 5. Environment Variables

**Backend (.env)**:
\`\`\`env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=notes_app
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
\`\`\`

**Frontend (.env)**:
\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

### 6. Run Applications

**Backend**:
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Frontend**:
\`\`\`bash
cd frontend
npm start
\`\`\`

## 📚 API Endpoints

- **POST** `/api/auth/register` - Register user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/logout` - Logout user
- **GET** `/api/auth/me` - Get current user
- **GET** `/api/notes` - Get notes with pagination/search
- **POST** `/api/notes` - Create note
- **DELETE** `/api/notes/:id` - Delete note
- **GET** `/api/analytics/tags` - Get tag analytics

  ![Screenshot 2025-05-31 114514](https://github.com/user-attachments/assets/79621e7c-e7cd-44a4-8acb-e82f477e8c5c)
![Screenshot 2025-05-31 114455](https://github.com/user-attachments/assets/d99b18d9-2e4c-4719-9918-87dddadb6be2)
![Screenshot 2025-05-31 114550](https://github.com/user-attachments/assets/d31195d7-687f-4521-a892-247da9379992)

