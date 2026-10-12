import { loadExpoClip } from './expoAudioClip';
import { createSequencePlayer } from './sequencePlayer';

export type { SequencePlayer } from './sequencePlayer';

/** A fresh player; screens preload their pack's clips on entry and release them on exit. */
export const createPlayer = () => createSequencePlayer(loadExpoClip);
