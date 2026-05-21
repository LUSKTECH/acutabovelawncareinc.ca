import { describe, it, expect } from 'vitest';
import { safeJsonLd } from '@/lib/json-ld';

describe('safeJsonLd', () => {
  it('serializes a plain object to JSON', () => {
    const result = safeJsonLd({ name: 'Test', value: 42 });
    expect(JSON.parse(result)).toEqual({ name: 'Test', value: 42 });
  });

  it('escapes < to \\u003c to prevent </script> injection', () => {
    const result = safeJsonLd({ evil: '</script><script>alert(1)</script>' });
    expect(result).not.toContain('</script>');
    expect(result).toContain('\\u003c');
    // Must still parse correctly
    expect(JSON.parse(result).evil).toBe('</script><script>alert(1)</script>');
  });

  it('handles nested objects and arrays', () => {
    const data = { items: [{ name: 'A', val: 1 }, { name: 'B', val: 2 }] };
    const result = safeJsonLd(data);
    expect(JSON.parse(result)).toEqual(data);
  });
});
