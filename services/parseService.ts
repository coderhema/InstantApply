export class ParseService {
  private scraperId: string;
  private authToken: string;
  private baseUrl: string = "https://api.parse.bot/scraper";

  constructor() {
    this.scraperId = import.meta.env.VITE_PARSE_BOT_API_KEY || "";
    this.authToken = import.meta.env.VITE_PARSE_BOT_AUTH_TOKEN || "";

    // Use local proxy if running on localhost to avoid CORS issues
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      this.baseUrl = "/api/parse";
    }

    if (!this.scraperId) {
      console.warn("Parse.bot Scraper ID (VITE_PARSE_BOT_API_KEY) is missing.");
    }
  }

  async runScraper(url: string): Promise<any> {
    if (!this.scraperId) {
      throw new Error("Parse.bot scraper ID is not configured.");
    }

    // Use the specialized "extract" method for form automation
    const endpoint = `${this.baseUrl}/${this.scraperId}/extract_form_fields`;
    console.log(`[ParseService] Calling endpoint: ${endpoint}`);
    console.log(`[ParseService] Auth token present: ${!!this.authToken}`);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
        headers["X-API-Key"] = this.authToken;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          form_url: url
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ParseService] Error response:`, errorText);
        throw new Error(`Parse.bot API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to run Parse.bot scraper:", error);
      throw error;
    }
  }
}

export const parseService = new ParseService();
