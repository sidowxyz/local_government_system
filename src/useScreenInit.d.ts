export interface ScreenInitState {
  tab?: string;
  service?: string;
  state?: string;
  query?: string;
  [key: string]: unknown;
}

export declare function useScreenInit(): ScreenInitState;
