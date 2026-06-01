export function useTheme() {
  // Monitor is always dark themed
  return {
    isDark: true,
    toggleTheme: () => {},
  }
}
