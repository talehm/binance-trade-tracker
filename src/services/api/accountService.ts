
import { AccountInfo } from "./types";
import { API_CONFIG } from "./config";
import { buildHeaders, handleApiError } from "./utils";

export class AccountService {
  private apiKey: string | null;
  private apiSecret: string | null;
  
  constructor(apiKey: string | null, apiSecret: string | null) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
  
  /**
   * Test connectivity to the API and validate API key
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('API key and secret are required');
      }
      
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/ping`, {
        headers: buildHeaders(this.apiKey, this.apiSecret)
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to Binance API');
      }
      
      return true;
    } catch (error) {
      return handleApiError(error, 'Failed to connect to Binance API') !== null;
    }
  }
  
  /**
   * Get account information
   */
  async getAccountInfo(): Promise<AccountInfo | null> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('API credentials required');
      }
      
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/account`, {
        headers: buildHeaders(this.apiKey, this.apiSecret)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'Failed to load account information');
    }
  }
}
