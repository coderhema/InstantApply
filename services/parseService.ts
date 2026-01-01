
export class ParseService {
  private scraperId: string;
  private baseUrl: string = "https://www.parse.bot/api/v1/scrapers";

  constructor() {
    this.scraperId = import.meta.env.VITE_PARSE_BOT_API_KEY || "";
    if (!this.scraperId) {
      console.warn("Parse.bot API key (VITE_PARSE_BOT_API_KEY) is missing.");
    }
  }

  async runScraper(url: string): Promise<any> {
    if (!this.scraperId) {
      throw new Error("Parse.bot scraper ID is not configured.");
    }

    const endpoint = `${this.baseUrl}/${this.scraperId}/run`;
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
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
