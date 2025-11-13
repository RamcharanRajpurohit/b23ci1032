import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Repositories
import { PostgresRouteRepository } from './src/adapters/outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceRepository } from './src/adapters/outbound/postgres/PostgresComplianceRepository';

// Use Cases
import { ComputeComparisonUseCase } from './src/core/application/ComputeComparisonUseCase';
import { ComputeCBUseCase } from './src/core/application/ComputeCBUseCase';
import { BankSurplusUseCase } from './src/core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from './src/core/application/ApplyBankedUseCase';
import { CreatePoolUseCase } from './src/core/application/CreatePoolUseCase';

// Controllers
import { RoutesController } from './src/adapters/inbound/http/routes.controller';
import { ComplianceController } from './src/adapters/inbound/http/compliance.controller';
import { BankingController } from './src/adapters/inbound/http/banking.controller';
import { PoolsController } from './src/adapters/inbound/http/pools.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
});

// Handle pool errors to prevent crashes
pool.on('error', (err, client) => {
  console.error('⚠️  Unexpected database pool error:', err.message);
  console.log('🔄 Connection will be automatically recreated');
});

// Test database connection
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.error('💡 Hint: Check your DATABASE_URL in .env file');
    console.error('💡 Make sure you are using the Pooler connection string from Supabase');
  });

// Initialize repositories
const routeRepository = new PostgresRouteRepository(pool);
const complianceRepository = new PostgresComplianceRepository(pool);

// Initialize use cases
const computeComparisonUseCase = new ComputeComparisonUseCase(routeRepository);
const computeCBUseCase = new ComputeCBUseCase(routeRepository, complianceRepository);
const bankSurplusUseCase = new BankSurplusUseCase(complianceRepository);
const applyBankedUseCase = new ApplyBankedUseCase(complianceRepository);
const createPoolUseCase = new CreatePoolUseCase(complianceRepository);

// Initialize controllers
const routesController = new RoutesController(routeRepository, computeComparisonUseCase);
const complianceController = new ComplianceController(computeCBUseCase, complianceRepository);
const bankingController = new BankingController(bankSurplusUseCase, applyBankedUseCase, complianceRepository);
const poolsController = new PoolsController(createPoolUseCase);

// Routes endpoints
app.get('/routes', routesController.getAllRoutes);
app.post('/routes/:id/baseline', routesController.setBaseline);
app.get('/routes/comparison', routesController.getComparison);

// Compliance endpoints
app.get('/compliance/cb', complianceController.getComplianceBalance);
app.get('/compliance/adjusted-cb', complianceController.getAdjustedCB);

// Banking endpoints
app.get('/banking/records', bankingController.getBankRecords);
app.post('/banking/bank', bankingController.bankSurplus);
app.post('/banking/apply', bankingController.applyBanked);

// Pools endpoints
app.post('/pools', poolsController.createPool);

// Health check endpoint for Vercel
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FuelEU Maritime Compliance API',
    version: '1.0.0'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
    
    // Stop accepting new connections
    server.close(async () => {
      console.log('📪 HTTP server closed');
      
      // Close database pool
      try {
        await pool.end();
        console.log('🔌 Database connections closed');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing database:', err);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('⏰ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  });
}

// Export the Express app for Vercel serverless
export default app;
