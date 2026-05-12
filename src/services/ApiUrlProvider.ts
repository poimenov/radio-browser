export class ApiUrlProvider {
    private async getRadioBrowserBaseUrls(): Promise<string[]> {
      const response = await fetch('http://all.api.radio-browser.info/json/servers');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch server list: ${response.statusText}`);
      }
      
      const data = await response.json() as Array<{ name: string }>;
      return data.map(server => `https://${server.name}`);
    }

  async getUrl(): Promise<string> {
    const hosts = await this.getRadioBrowserBaseUrls();
    const randomIndex = Math.floor(Math.random() * hosts.length);
    return hosts[randomIndex];
  }

}