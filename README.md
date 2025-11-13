# Personal ERP Application

A comprehensive family resource management system with multi-tenancy support. Manage household items, clothing, and miscellaneous items with separate instances for different families.

## Features

- **Multi-Tenancy**: Each family/group gets their own isolated data instance
- **User Authentication**: Secure JWT-based authentication
- **Multiple Modules**:
  - **Household Items**: Track furniture, appliances, electronics, etc.
  - **Clothing**: Manage clothing items with details like size, color, brand, season
  - **Miscellaneous**: Store documents, tools, hobby items, and more
- **Comprehensive Tracking**: Record purchase dates, prices, locations, conditions, and notes
- **Responsive Design**: Works on desktop and mobile devices
- **Cost-Effective**: Designed to run on free/cheap hosting

## Tech Stack

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** ORM with SQLite/PostgreSQL
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Zod** for validation

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

## Project Structure

```
Personal-ERP-Application/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth middleware
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Utilities (JWT, Prisma)
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── context/            # Auth context
│   │   ├── services/           # API service
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── vite.config.ts
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Personal-ERP-Application.git
cd Personal-ERP-Application
```

2. **Setup Backend**
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set your JWT_SECRET
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-secret-key-change-this"
# PORT=3000

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:3000`

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start the frontend dev server
npm run dev
```

The frontend will start on `http://localhost:5173`

4. **Access the Application**

Open your browser and navigate to `http://localhost:5173`

### First Time Setup

1. Click "Register here" on the login page
2. Fill in your details:
   - Your name
   - Email address
   - Password (minimum 6 characters)
   - Family/Group name (e.g., "Smith Family")
3. Click "Create Account"
4. You'll be automatically logged in to your dashboard

## Usage

### Dashboard
- View summary of all your items across all modules
- Quick access to each module
- See total item counts

### Adding Items

1. Navigate to any module (Household, Clothing, or Miscellaneous)
2. Click "Add Item" button
3. Fill in the item details:
   - **Required**: Name, Category
   - **Optional**: Description, Quantity, Location, Purchase Date, Price, Condition, Notes
4. Click "Add Item" to save

### Managing Items

- **View**: All items are displayed as cards with key information
- **Edit**: Click "Edit" button on any item card to modify details
- **Delete**: Click "Delete" button to remove an item (with confirmation)
- **Search**: Items can be filtered by category (via the category badges)

### Categories Examples

**Household Items**:
- Furniture (sofa, table, bed)
- Appliances (refrigerator, microwave, washing machine)
- Electronics (TV, computer, speakers)
- Kitchen (dishes, utensils, cookware)

**Clothing**:
- Shirts, pants, dresses, shoes
- Accessories (bags, watches, jewelry)
- Seasonal wear (winter coats, summer hats)
- By family member

**Miscellaneous**:
- Documents (passports, certificates, warranties)
- Tools (hammer, screwdriver, drill)
- Hobby items (sports equipment, art supplies)
- Collectibles

## Multi-Tenancy

The application supports multiple families/groups:

1. Each registration creates a new "tenant" (family/group)
2. All data is isolated per tenant
3. Users can only see and manage their own tenant's data
4. Friends can create their own separate instances by registering with different emails

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user and tenant
- `POST /api/auth/login` - Login user

### Household Items
- `GET /api/household` - Get all household items
- `GET /api/household/:id` - Get specific item
- `POST /api/household` - Create new item
- `PUT /api/household/:id` - Update item
- `DELETE /api/household/:id` - Delete item

### Clothing Items
- `GET /api/clothing` - Get all clothing items
- `GET /api/clothing/:id` - Get specific item
- `POST /api/clothing` - Create new item
- `PUT /api/clothing/:id` - Update item
- `DELETE /api/clothing/:id` - Delete item

### Miscellaneous Items
- `GET /api/miscellaneous` - Get all miscellaneous items
- `GET /api/miscellaneous/:id` - Get specific item
- `POST /api/miscellaneous` - Create new item
- `PUT /api/miscellaneous/:id` - Update item
- `DELETE /api/miscellaneous/:id` - Delete item

All endpoints (except auth) require `Authorization: Bearer <token>` header.

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses tsx watch for hot reloading
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Database Management

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Building for Production

**Backend**:
```bash
cd backend
npm run build      # Compiles TypeScript to dist/
npm start          # Runs compiled code
```

**Frontend**:
```bash
cd frontend
npm run build      # Creates optimized build in dist/
npm run preview    # Preview production build
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Free tier deployment (Vercel + Railway)
- Budget VPS deployment ($5-10/month)
- Docker deployment
- Database migration from SQLite to PostgreSQL
- Cost comparisons

### Quick Deploy Options

**Free Tier** (Recommended for personal use):
- Frontend: Deploy to Vercel or Netlify (free)
- Backend: Deploy to Railway or Render (free tier)
- Database: Use Railway PostgreSQL or Supabase (free tier)

**Budget VPS** (More control):
- Single VPS from DigitalOcean/Linode ($5-6/month)
- Host everything on one server
- Use PM2 for process management
- Nginx as reverse proxy

## Security Considerations

1. **Change JWT_SECRET**: Use a strong random string in production
2. **Use HTTPS**: Always use HTTPS in production
3. **Strong Passwords**: Enforce strong passwords (minimum 6 characters, can be increased)
4. **Environment Variables**: Never commit `.env` files
5. **Regular Updates**: Keep dependencies updated
6. **Database Backups**: Regular backups of your database

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Ensure `.env` file exists with correct values
- Run `npx prisma generate` and `npx prisma migrate dev`

### Frontend can't connect to backend
- Check if backend is running on port 3000
- Verify Vite proxy configuration in `vite.config.ts`
- Check browser console for CORS errors

### Database errors
- Delete `dev.db` and run `npx prisma migrate dev` again
- Check DATABASE_URL in `.env`
- Ensure Prisma client is generated: `npx prisma generate`

### Login/Registration not working
- Check browser console for errors
- Verify backend is running and accessible
- Check network tab in browser dev tools

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Roadmap

Future enhancements:
- [ ] Image uploads for items
- [ ] CSV export/import
- [ ] Categories management
- [ ] Search and advanced filtering
- [ ] Dashboard analytics and charts
- [ ] Mobile app (React Native)
- [ ] Shared items between family members
- [ ] Barcode scanning
- [ ] Warranty expiration reminders
- [ ] Budget tracking

## Acknowledgments

Built with modern, production-ready technologies designed for cost-effective deployment and easy maintenance.
