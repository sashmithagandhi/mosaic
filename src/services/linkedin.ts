/**
 * Modular LinkedIn Integration Layer
 * Connects to professional profile data. Keeps integration cleanly decoupled
 * from UI logic so a real OAuth 2.0 / LinkedIn API adapter can replace the prototype service.
 */

export interface LinkedInProfileData {
  linkedinUrl: string;
  name?: string;
  headline?: string;
  college?: string;
  course?: string;
  year?: string;
  skills?: string[];
  summary?: string;
}

export class LinkedInService {
  /**
   * Prototype flow: Simulates OAuth handshake and fetches sanitized professional data.
   * Can be configured with real LinkedIn API credentials when deployed in production.
   */
  static async connectProfile(providedUrl?: string): Promise<{ success: boolean; data?: LinkedInProfileData; error?: string }> {
    // Artificial latency for realistic async connection
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanUrl = providedUrl?.trim() || 'https://linkedin.com/in/student-fellow';

    // Mock professional data payload matching LinkedIn profile structure
    const data: LinkedInProfileData = {
      linkedinUrl: cleanUrl,
      headline: 'Product Engineer & Systems Builder',
      college: 'Institute of Science & Technology',
      course: 'B.Tech Computer Science & Engineering',
      year: '3rd Year (Class of 2027)',
      skills: ['TypeScript', 'React', 'Distributed Systems', 'UI/UX Design', 'FastAPI'],
      summary: 'Passionate about building collaborative developer tools and human-centered software architectures.',
    };

    return {
      success: true,
      data,
    };
  }

  static validateLinkedInUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('linkedin.com/in/') || url.startsWith('http');
  }
}
