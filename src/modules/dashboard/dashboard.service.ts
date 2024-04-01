import { Injectable } from '@nestjs/common';
import { Major } from 'src/enums/majors.enum';

@Injectable()
export class DashboardService {
    constructor(){}

    async countDashboardStatistics(major: Major): Promise<any> {
        
    }
}
