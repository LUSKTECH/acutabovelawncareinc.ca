// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';

afterEach(cleanup);
import Lightbox from '@/components/gallery/Lightbox';
import ServiceGallery from '@/components/service/ServiceGallery';
import type { GalleryItem } from '@/lib/images';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    quality: _quality,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    quality?: number;
    [k: string]: unknown;
  }) => <img src={src} alt={alt} {...rest} />,
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

const ITEMS: GalleryItem[] = [
  { src: '/images/a.jpg', alt: 'Alpha', width: 800, height: 600 },
  { src: '/images/b.jpg', alt: 'Beta', width: 800, height: 600 },
  { src: '/images/c.jpg', alt: 'Gamma', width: 800, height: 600 },
];

const noop = vi.fn();

describe('Lightbox', () => {
  it('renders the dialog element', () => {
    render(
      <Lightbox items={ITEMS} openIndex={null} onClose={noop} onPrev={noop} onNext={noop} />,
    );
    expect(screen.getByRole('dialog', { hidden: true })).toBeTruthy();
  });

  it('shows Close/Prev/Next buttons when openIndex is provided', () => {
    render(
      <Lightbox items={ITEMS} openIndex={0} onClose={noop} onPrev={noop} onNext={noop} />,
    );
    expect(screen.getByRole('button', { name: /close/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /previous/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /next/i })).toBeTruthy();
  });

  it('hides controls when openIndex is null', () => {
    render(
      <Lightbox items={ITEMS} openIndex={null} onClose={noop} onPrev={noop} onNext={noop} />,
    );
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
  });

  it('calls onClose when Close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Lightbox items={ITEMS} openIndex={1} onClose={onClose} onPrev={noop} onNext={noop} />,
    );
    act(() => { fireEvent.click(screen.getByRole('button', { name: /close/i })); });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onPrev when Previous button is clicked', () => {
    const onPrev = vi.fn();
    render(
      <Lightbox items={ITEMS} openIndex={1} onClose={noop} onPrev={onPrev} onNext={noop} />,
    );
    act(() => { fireEvent.click(screen.getByRole('button', { name: /previous/i })); });
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when Next button is clicked', () => {
    const onNext = vi.fn();
    render(
      <Lightbox items={ITEMS} openIndex={0} onClose={noop} onPrev={noop} onNext={onNext} />,
    );
    act(() => { fireEvent.click(screen.getByRole('button', { name: /next/i })); });
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <Lightbox items={ITEMS} openIndex={0} onClose={onClose} onPrev={noop} onNext={noop} />,
    );
    act(() => { fireEvent.keyDown(window, { key: 'Escape' }); });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onPrev on ArrowLeft', () => {
    const onPrev = vi.fn();
    render(
      <Lightbox items={ITEMS} openIndex={1} onClose={noop} onPrev={onPrev} onNext={noop} />,
    );
    act(() => { fireEvent.keyDown(window, { key: 'ArrowLeft' }); });
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext on ArrowRight', () => {
    const onNext = vi.fn();
    render(
      <Lightbox items={ITEMS} openIndex={1} onClose={noop} onPrev={noop} onNext={onNext} />,
    );
    act(() => { fireEvent.keyDown(window, { key: 'ArrowRight' }); });
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('logs an error and renders null for out-of-bounds index', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(
      <Lightbox items={ITEMS} openIndex={99} onClose={noop} onPrev={noop} onNext={noop} />,
    );
    expect(container.firstChild).toBeNull();
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('locks body scroll when open', () => {
    render(
      <Lightbox items={ITEMS} openIndex={0} onClose={noop} onPrev={noop} onNext={noop} />,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });
});

// ── ServiceGallery ──────────────────────────────────────────────────────────

describe('ServiceGallery', () => {
  it('renders null when images array is empty', () => {
    const { container } = render(<ServiceGallery images={[]} title="Test" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the section heading with title', () => {
    render(<ServiceGallery images={['/a.jpg', '/b.jpg']} title="Lawn Aeration" />);
    expect(screen.getByText(/lawn aeration/i)).toBeTruthy();
  });

  it('renders a button per image', () => {
    render(<ServiceGallery images={['/a.jpg', '/b.jpg', '/c.jpg']} title="Retaining Walls" />);
    const btns = screen.getAllByRole('button', { name: /view retaining walls photo/i });
    expect(btns).toHaveLength(3);
  });

  it('opens the lightbox dialog when a thumbnail is clicked', () => {
    render(<ServiceGallery images={['/a.jpg']} title="Hardscaping" />);
    const btn = screen.getByRole('button', { name: /view hardscaping photo 1/i });
    act(() => { fireEvent.click(btn); });
    // showModal should have been called on the dialog
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('renders a Close button when the lightbox is open', () => {
    render(<ServiceGallery images={['/a.jpg']} title="Paving" />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /view paving photo 1/i }));
    });
    expect(screen.getByRole('button', { name: /close/i })).toBeTruthy();
  });

  it('closes the lightbox when Escape is pressed', () => {
    render(<ServiceGallery images={['/a.jpg']} title="Fencing" />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /view fencing photo 1/i }));
    });
    act(() => { fireEvent.keyDown(window, { key: 'Escape' }); });
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
  });
});
