/** The five statuses the ECG shows. There are no health points. */
export const HealthStatus = {
  Fine: 'fine',
  /** Fine, with a yellow ECG. */
  FineYellow: 'fine-yellow',
  Caution: 'caution',
  Danger: 'danger',
  Poison: 'poison',
} as const;

export type HealthStatus = (typeof HealthStatus)[keyof typeof HealthStatus];
