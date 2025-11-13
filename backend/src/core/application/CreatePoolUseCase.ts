import { IComplianceRepository } from '../ports/IComplianceRepository';
import { Pool, PoolMember } from '../domain/Compliance';

interface PoolRequest {
  year: number;
  members: Array<{ shipId: string; cbBefore: number }>;
}

export class CreatePoolUseCase {
  constructor(private complianceRepository: IComplianceRepository) {}

  async execute(request: PoolRequest): Promise<{ pool: Pool; members: PoolMember[] }> {
    // Validate sum of CB >= 0
    const totalCB = request.members.reduce((sum, m) => sum + m.cbBefore, 0);
    if (totalCB < 0) {
      throw new Error('Pool total compliance balance must be non-negative');
    }

    // Create pool
    const pool = await this.complianceRepository.createPool({
      year: request.year,
      createdAt: new Date()
    });

    // Allocate using greedy algorithm
    const members = this.allocatePool(request.members, pool.id!);

    // Validate constraints
    this.validateAllocation(request.members, members);

    // Save members
    await this.complianceRepository.addPoolMembers(members);

    return { pool, members };
  }

  private allocatePool(members: Array<{ shipId: string; cbBefore: number }>, poolId: number): PoolMember[] {
    const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore);
    const result: PoolMember[] = [];
    
    let surplusPool = 0;
    const deficits: Array<{ shipId: string; deficit: number }> = [];

    // Collect surplus and deficits
    for (const member of sorted) {
      if (member.cbBefore >= 0) {
        surplusPool += member.cbBefore;
      } else {
        deficits.push({ shipId: member.shipId, deficit: -member.cbBefore });
      }
    }

    // Allocate surplus to deficits
    for (const member of sorted) {
      if (member.cbBefore >= 0) {
        result.push({
          poolId,
          shipId: member.shipId,
          cbBefore: member.cbBefore,
          cbAfter: 0 // Surplus ships contribute all
        });
      } else {
        const coverage = Math.min(-member.cbBefore, surplusPool);
        result.push({
          poolId,
          shipId: member.shipId,
          cbBefore: member.cbBefore,
          cbAfter: member.cbBefore + coverage
        });
        surplusPool -= coverage;
      }
    }

    return result;
  }

  private validateAllocation(before: Array<{ shipId: string; cbBefore: number }>, after: PoolMember[]): void {
    for (let i = 0; i < before.length; i++) {
      const beforeMember = before[i];
      const afterMember = after.find(m => m.shipId === beforeMember.shipId)!;

      // Deficit ship cannot exit worse
      if (beforeMember.cbBefore < 0 && afterMember.cbAfter < beforeMember.cbBefore) {
        throw new Error(`Ship ${beforeMember.shipId} would exit worse than entry`);
      }

      // Surplus ship cannot exit negative
      if (beforeMember.cbBefore > 0 && afterMember.cbAfter < 0) {
        throw new Error(`Surplus ship ${beforeMember.shipId} would exit negative`);
      }
    }
  }
}
