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

  async submitForm(url: string, formData: Record<string, any>): Promise<any> {
    if (!this.scraperId) throw new Error("Parse.bot scraper ID is not configured.");

    // Using the 'auto_fill_and_submit_form' capability (conceptual endpoint based on research)
    // Adjusting to standard scraper run pattern if specific endpoint differs, 
    // but assuming /start or specific /submit endpoint exists for this feature.
    const endpoint = `${this.baseUrl}/${this.scraperId}/start`;

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
        headers["X-API-Key"] = this.authToken;
      }

      // Parse.bot usually takes an 'options' object for actions
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          url: url,
          options: {
            action: "fill_and_submit",
            data: formData
          }
        })
      });

      if (!response.ok) throw new Error(`Parse.bot Submit Failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Parse.bot Cloud Fill failed:", error);
      throw error;
    }
  }
}

export const parseService = new ParseService();
