export interface Command {
  name: string;
  value?: number | string;
  commands?: Command[];
}
