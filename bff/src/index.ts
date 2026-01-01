import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authRouter as authRoutes } from './routes/auth';
import { worldRouter as worldRoutes } from './routes/worlds';
import { healthRouter as healthRoutes } from './routes/health';

// Load environment variables
dotenv.config();

class BFFServer {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = process.env.BFF_PORT ? parseInt(process.env.BFF_PORT) : 3001;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use('/api', limiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);
  }

  private initializeRoutes(): void {
    // Health check (no auth required)
    this.app.use('/api/health', healthRoutes);

    // Authentication routes (no auth required)
    this.app.use('/api/auth', authRoutes);

    // Protected routes (require authentication)
    this.app.use('/api/worlds', authMiddleware, worldRoutes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 BFF Server running on port ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${this.port}/api/auth`);
      console.log(`🌍 Protected endpoints: http://localhost:${this.port}/api/*`);
    });
  }
}

// Start the BFF server
const server = new BFFServer();
server.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});