// login
export interface User {
  name: string
  email: string
}
export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  location: string;
};

export interface LoginCredentials {
  username: string;
  password: string;
}
export interface AuthContextType {
  isLoggedIn: boolean
  loading: boolean
  user: User | null
  login: (userData: User) => void
  logout: () => void
}
export type LoginFormData = {
  username: string;
  password: string;
};

//policy document
export type DocumentCategory =
  | "Security"
  | "Compliance"
  | "HR"
  | "Procurement"
  | "Operations";
export interface PolicyDocument {
  id: number;
  name: string;
  category: DocumentCategory;
  updated: string;
  description?: string;
  url?:string;
}
// chat
export type MessageRole = "user" | "assistant" | "loading";
export interface Message {
  id: string;
  role: "user" | "assistant" | "loading";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  sources?: number[];
}