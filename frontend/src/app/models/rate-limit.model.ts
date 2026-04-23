export interface RateLimit {
  scope: string;
  ip_hash: string;
  count?: number | null;
  reset_at: string;
  updated?: string | null;
}
