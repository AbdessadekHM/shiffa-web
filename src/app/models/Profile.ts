export interface Profile {
  id: number;
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  created_at: string;
  type:string;
}