
export interface OfficerRating {
  rating: number;
  comment: string;
  rated_by: string;
}

export interface Complaint {
    complaint: any;
    id: number;
    user: string;
    officer?: string;
    admin?: string;
    title: string;
    description: string;
    area_name: string;
    location_link: string;
    created_at: string;
    status: 'PENDING' | 'WORK_ON_PROGRESS' | 'RESOLVED';
    officer_ratings: OfficerRating[],
    image?: string;
  }
  