export interface Student {
  id: number;
  student_name: string;
  class_name: string;
  parent_mobile: string;
  last_called_at: string | null;
}

export interface RPCParams {
  search_number: string;
}