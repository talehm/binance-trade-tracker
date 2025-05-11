
import { AccountInfo } from "./types";
import { API_CONFIG } from "./config";
import { buildHeaders, handleApiError } from "./utils";

export class AccountService {
  /**
   * Test connectivity to the API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/ping`, {
        headers: buildHeaders()
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
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/account`, {
        headers: buildHeaders()
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
