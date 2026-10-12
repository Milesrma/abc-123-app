import { Clip, createSequencePlayer } from '../src/audio/sequencePlayer';

function fakeLoader() {
  const log: string[] = [];
  const pending = new Map<string, () => void>();
  const loads: string[] = [];
  const load = (path: string): Clip => {
    loads.push(path);
    return {
      play: () => { log.push(`play ${path}`); return new Promise<void>((r) => pending.set(path, r)); },
      stop: () => { log.push(`stop ${path}`); pending.get(path)?.(); },
      release: () => { log.push(`release ${path}`); },
    };
  };
  const finish = (p: string) => pending.get(p)?.();
  return { log, loads, load, finish };
}
const tick = () => new Promise((r) => setImmediate(r));

describe('sequence player', () => {
  it('plays clips in order, each after the previous finishes', async () => {
    const f = fakeLoader();
    const p = createSequencePlayer(f.load);
    const done = p.play(['a', 'b']);
    await tick();
    expect(f.log).toEqual(['play a']);
    f.finish('a');
    await tick();
    expect(f.log).toEqual(['play a', 'play b']);
    f.finish('b');
    await done;
  });

  it('a new tap stops the current sequence and starts over', async () => {
    const f = fakeLoader();
    const p = createSequencePlayer(f.load);
    const first = p.play(['a', 'b']);
    await tick();
    const second = p.play(['c']);
    await tick();
    await first;
    expect(f.log).toEqual(['play a', 'stop a', 'play c']);
    expect(f.log).not.toContain('play b');
    f.finish('c');
    await second;
  });

  it('loads each clip only once (preload then play)', async () => {
    const f = fakeLoader();
    const p = createSequencePlayer(f.load);
    p.preload(['a', 'b']);
    const done = p.play(['a']);
    await tick();
    f.finish('a');
    await done;
    expect(f.loads).toEqual(['a', 'b']);
  });

  it('stop() ends playback and release() frees every clip', async () => {
    const f = fakeLoader();
    const p = createSequencePlayer(f.load);
    const done = p.play(['a', 'b']);
    await tick();
    p.stop();
    await done;
    expect(f.log).not.toContain('play b');
    p.release();
    expect(f.log).toContain('release a');
  });
});
