import { Request, Response } from 'express';
import { CreatePoolUseCase } from '@core/application/CreatePoolUseCase';

export class PoolsController {
  constructor(private createPoolUseCase: CreatePoolUseCase) {}

  createPool = async (req: Request, res: Response) => {
    try {
      const { year, members } = req.body;
      if (!year || !members || !Array.isArray(members)) {
        return res.status(400).json({ error: 'year and members array are required' });
      }

      const result = await this.createPoolUseCase.execute({ year, members });
      res.json(result);
    } catch (error: any) {
      console.error('❌ Pool creation error:', error.message);
      console.error('📋 Full error:', error);
      
      // Check if it's a database connection error
      if (error.message.includes('Tenant or user not found')) {
        console.error('💡 This is a Supabase connection error!');
        console.error('💡 Fix: Update DATABASE_URL in .env with correct Pooler connection string');
      }
      
      res.status(400).json({ error: error.message });
    }
  };
}
