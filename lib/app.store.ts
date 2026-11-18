// Define an interface for the global state to ensure type safety.
// You can extend this interface with all the global variables you need.
export interface GlobalAppState {
  darkMode: boolean;
  // Add other global variables here as your application grows, e.g.:
  // user: { id: string; name: string } | null;
  // currentPostId: number | null;
  // isLoading: boolean;
}

/**
 * AppStore is a singleton class for managing global application state.
 * It provides methods to set and get global variables in a type-safe manner.
 */
class AppStore {
  private static instance: AppStore;
  private state: GlobalAppState;

  private constructor() {
    // Initialize the global state with default values.
    // This ensures that all properties defined in GlobalAppState have an initial value.
    this.state = {
      darkMode: false,
      // Initialize other global variables here with their default states.
    };
  }

  /**
   * Returns the singleton instance of the AppStore.
   * This ensures that only one instance of the store exists throughout the application.
   */
  public static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  /**
   * Sets a value for a specific key in the global state.
   * @param key The key (property name) of the state to update.
   * @param value The new value for the specified state property.
   */
  public set<K extends keyof GlobalAppState>(key: K, value: GlobalAppState[K]): void {
    this.state = {
      ...this.state,
      [key]: value,
    };

  }

  /**
   * Gets the current value of a specific key from the global state.
   * @param key The key (property name) of the state to retrieve.
   * @returns The value of the specified state property.
   */
  public get<K extends keyof GlobalAppState>(key: K): GlobalAppState[K] {
    return this.state[key];
  }

  /**
   * Returns a shallow copy of the entire global state.
   * This is useful for reading multiple state values or for debugging,
   * while preventing direct external modification of the internal state object.
   */
  public getState(): Readonly<GlobalAppState> {
    return { ...this.state };
  }

  /**
   * Resets the store to its initial state.
   * Use with caution, primarily for testing or specific application reset scenarios.
   */
  public reset(): void {
    this.state = {
      darkMode: false,
      // Reset other global variables to their initial values here.
    };
  }
}

// Export a pre-instantiated singleton instance for easy access throughout the application.
// You can import `appStore` from anywhere and use its `get` and `set` methods.
export const appStore = AppStore.getInstance();