export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
};

export type Role = {
  id: string;
  name: string;
  description: string | null;
};

export type AuthUser = {
  id: string;
  email?: string;
  name?: string | null;
  roles: string[];
};
