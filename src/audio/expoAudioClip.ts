import { createAudioPlayer } from 'expo-audio';
import { resolveAsset } from '../content/loader';
import type { Clip } from './sequencePlayer';

/** Wraps an expo-audio player (loaded once, so a tap plays with no lag) as a Clip. */
export function loadExpoClip(path: string): Clip {
  const player = createAudioPlayer(resolveAsset(path));
  let finish: (() => void) | null = null;

  const sub = player.addListener('playbackStatusUpdate', (status) => {
    if (status.didJustFinish) {
      finish?.();
      finish = null;
    }
  });

  return {
    play() {
      finish?.();
      return new Promise<void>((resolve) => {
        finish = resolve;
        player.seekTo(0).catch(() => {});
        player.play();
      });
    },
    stop() {
      player.pause();
      finish?.();
      finish = null;
    },
    release() {
      sub.remove();
      player.remove();
    },
  };
}
