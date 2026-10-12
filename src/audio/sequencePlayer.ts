/** One loaded sound. `play()` resolves when it finishes (or is stopped). */
export interface Clip {
  play(): Promise<void>;
  stop(): void;
  release(): void;
}

export interface SequencePlayer {
  preload(paths: string[]): void;
  /** Plays the clips one after another. Starting a new sequence stops the current one. */
  play(paths: string[]): Promise<void>;
  stop(): void;
  release(): void;
}

export function createSequencePlayer(load: (path: string) => Clip): SequencePlayer {
  const clips = new Map<string, Clip>();
  let token = 0;
  let current: Clip | null = null;

  const get = (path: string) => {
    let clip = clips.get(path);
    if (!clip) {
      clip = load(path);
      clips.set(path, clip);
    }
    return clip;
  };

  const stop = () => {
    token += 1;
    current?.stop();
    current = null;
  };

  return {
    preload(paths) {
      paths.forEach(get);
    },
    async play(paths) {
      stop();
      const mine = token;
      for (const path of paths) {
        if (mine !== token) return;
        current = get(path);
        await current.play();
      }
      if (mine === token) current = null;
    },
    stop,
    release() {
      stop();
      clips.forEach((c) => c.release());
      clips.clear();
    },
  };
}
