import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { serverConfig } from './config/env';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './routes/auth';
import worldRoutes from './routes/worlds';
import chapterRoutes from './routes/chapters';
import characterRoutes from './routes/characters';
import eventRoutes from './routes/events';
import sceneRoutes from './routes/scenes';
import dialogueRoutes from './routes/dialogues';
import healthRoutes from './routes/health';

class BFFServer {
  private app: Express;
  private port: number;

  constructor(port: number = parseInt(serverConfig.bffPort.toString())) {
    this.app = express();
    this.port = port;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: serverConfig.frontendUrl,
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
    this.app.use('/api/chapters', authMiddleware, chapterRoutes);
    this.app.use('/api/characters', authMiddleware, characterRoutes);
    this.app.use('/api/events', authMiddleware, eventRoutes);
    this.app.use('/api/scenes', authMiddleware, sceneRoutes);
    this.app.use('/api/dialogues', authMiddleware, dialogueRoutes);

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

  public getApp(): Express {
    return this.app;
  }
}

export default BFFServer;