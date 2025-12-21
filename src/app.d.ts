// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Locals {}
    // interface PageData {}
    // interface Error {}
    interface Platform {
      env: {
        ENVIRONMENT: "production" | "staging";
        SITE_URL: string;
      };
    }
  }
}

export {};
