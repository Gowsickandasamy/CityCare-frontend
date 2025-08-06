export interface Officer {
    userId: number;
    username: string;
    email: string;
    phone_number:string;
    area_of_control: string;
    reports_to?: number | null;
    average_rating: number;
    reports_count:number;
    created_at:string;
    resolved_count:number;
    pending_count:number;
    
  }