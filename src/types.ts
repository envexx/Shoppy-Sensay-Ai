/**
 * Type definitions untuk Sensay API responses
 */

export interface User {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Replica {
  uuid: string;
  name: string;
  shortDescription?: string;
  greeting?: string;
  ownerID: string;
  private: boolean;
  slug: string;
  llm?: {
    provider: string;
    model: string;
  };
  system_message?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatResponse {
  content: string;
  role: 'assistant' | 'user';
  timestamp?: string;
}

export interface SetupResult {
  userId: string;
  replicaUuid: string;
  replicaName: string;
}

export interface CreateUserRequest {
  id: string;
}

export interface CreateReplicaRequest {
  name: string;
  shortDescription?: string;
  greeting?: string;
  ownerID: string;
  private: boolean;
  slug: string;
  llm?: {
    provider: string;
    model: string;
  };
  system_message?: string;
}

export interface ChatRequest {
  content: string;
}

