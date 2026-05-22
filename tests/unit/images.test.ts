import { describe, it, expect, vi, beforeEach } from 'vitest';

const fsMock = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
}));
vi.mock('node:fs', () => fsMock);

const sharpMock = vi.hoisted(() => vi.fn());
vi.mock('sharp', () => ({ default: sharpMock }));

import { getGalleryItems } from '@/lib/images';

beforeEach(() => {
  fsMock.existsSync.mockReset();
  fsMock.readdirSync.mockReset();
  sharpMock.mockReset();
});

describe('getGalleryItems', () => {
  it('returns [] when the gallery directory is missing', async () => {
    fsMock.existsSync.mockReturnValue(false);
    await expect(getGalleryItems()).resolves.toEqual([]);
  });

  it('skips images with unreadable dimensions and logs a warning', async () => {
    fsMock.existsSync.mockReturnValue(true);
    fsMock.readdirSync.mockReturnValue(['broken.jpg']);
    sharpMock.mockReturnValue({
      metadata: vi.fn().mockResolvedValue({ width: undefined, height: undefined }),
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const items = await getGalleryItems();
    expect(items).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[images]'),
      expect.anything(),
    );
    errorSpy.mockRestore();
  });

  it('filters non-image files, sorts by src, and humanizes alt text', async () => {
    fsMock.existsSync.mockReturnValue(true);
    fsMock.readdirSync.mockReturnValue([
      'zebra-stones.jpg',
      'apple_orchard.png',
      'notes.txt',
      'banner.webp',
    ]);
    sharpMock.mockReturnValue({
      metadata: vi.fn().mockResolvedValue({ width: 1200, height: 800 }),
    });

    const items = await getGalleryItems();
    expect(items.map((i) => i.src)).toEqual([
      '/images/gallery/apple_orchard.png',
      '/images/gallery/banner.webp',
      '/images/gallery/zebra-stones.jpg',
    ]);
    expect(items[0]?.alt).toBe('Apple Orchard');
    expect(items[1]?.alt).toBe('Banner');
    expect(items[2]?.alt).toBe('Zebra Stones');
    for (const item of items) {
      expect(item.width).toBe(1200);
      expect(item.height).toBe(800);
    }
  });

  it('falls back to a generic alt when humanize() yields an empty string', async () => {
    fsMock.existsSync.mockReturnValue(true);
    fsMock.readdirSync.mockReturnValue(['1234.jpg']); // digits stripped → empty
    sharpMock.mockReturnValue({
      metadata: vi.fn().mockResolvedValue({ width: 800, height: 600 }),
    });
    const items = await getGalleryItems();
    expect(items[0]?.alt).toBe('Landscaping project');
  });
});
