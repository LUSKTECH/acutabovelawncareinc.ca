// Vitest global setup. Clear call history between tests but preserve mock
// implementations registered by vi.mock() factories.
import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});
