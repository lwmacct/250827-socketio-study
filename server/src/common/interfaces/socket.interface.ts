/**
 * Socket.IO 相关接口定义
 */

export interface ClientInfo {
  id: string;
  connectedAt: Date;
  rooms: Set<string>;
  lastActivity: Date;
}

export interface RoomStats {
  onlineUsers: number;
  rooms: Record<string, number>;
  timestamp: string;
}

export interface MessageData {
  message: string;
  sender: string;
}

export interface RoomData {
  room: string;
}

export interface RoomMessageData {
  room: string;
  message: string;
  sender: string;
}

export interface ConnectionResponse {
  clientId: string;
  message: string;
  timestamp: string;
  onlineUsers: number;
}

export interface RoomJoinResponse {
  room: string;
  message: string;
  timestamp: string;
  roomMembers: number;
}

export interface RoomLeaveResponse {
  room: string;
  message: string;
  timestamp: string;
}

export interface UserActionData {
  clientId: string;
  room?: string;
  message: string;
  timestamp: string;
  roomMembers?: number;
}

export interface ErrorResponse {
  message: string;
}

export interface StatsResponse {
  onlineUsers: number;
  rooms: Record<string, number>;
  clientInfo?: ClientInfo;
  timestamp: string;
}
