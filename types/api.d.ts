import { Request, Response } from 'express';
import { SessionData } from './models';

export interface AuthenticatedRequest extends Request {
  sessionData?: SessionData;
  sessionId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChartParams {
  chartType?: string;
  measure?: string;
}

export interface RouteParams {
  chartType?: string;
  measure?: string;
}

export interface ChartBuilder {
  id: string;
  name: string;
  chartType: string;
  build: (activities: any[]) => any;
}

export interface ChartData {
  columns: any[];
  rows: any[][];
  options?: any;
}