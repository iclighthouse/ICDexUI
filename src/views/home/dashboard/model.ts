export interface ICTCStatus {
  id: string;
  name: string;
  version: string;
  type: string;
  paused: boolean;
  TOs: number;
  TTs: number;
  TOBlocking: number;
  TTErrors: number
}
