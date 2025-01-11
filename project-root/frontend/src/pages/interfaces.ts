export interface Endpoint {
    id: number;
    hostname: string;
    ip_address: string;
    status: string;
  }
  
  export interface Application {
    id: string;
    name: string;
    description: string;
    status: string;
    endpoints: Endpoint[];
  }
  