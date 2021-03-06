import { isNil } from 'ramda';
/**
 * @typedef {Object} Note
 * @property {string} pitchClass - The pitch in chromatic scale (english notation)
 * @property {number} octave - The octave value associated to pitch class
 */

/**
 * pitchClasses provides the chromatic scale symbols exported as a list:
 * 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
 * @type {Object}
 */
export const pitchClasses = Object.freeze(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']);

/**
 * Computes the frequency value of the given midi note
 * with custom, optional tuning (default value for
 * tuning is 440 for A4)
 * This curry function will be partially applied if tuning
 * is the only parameter
 * @param {number} tuning - The frequency associated to midi value 69 (A4)
 * @param {number} midiValue - Midi value (0 to 127) of the note
 * @returns {number|function} The computed frequency or a computing function
 */
export function midiToFrequency(tuning = 440, midiValue) {
	if (isNil(midiValue)) {
		return _ => midiToFrequency(tuning, _);
	}
	if (midiValue >= 0 && midiValue <= 127) {
		return tuning * (2 ** ((midiValue - 69) / 12));
	}
	return null;
}

/**
 * Computes the midiValue value of the given note in the given octave
 * @param {string} pitchClass - Note in scale (english notation)
 * @param {number} octave - Octave value for note
 */
export function symbolToMidi(pitchClass, octave) {
	return ((octave + 1) * 12) + pitchClasses.indexOf(pitchClass);
}

/**
 * Computes the pitch class and octave for the given midi value
 * @param {number} midiValue - Octave value for note
 * @returns {Note}
 */
export function midiToSymbol(midiValue) {
	const pitchClassIndex = (midiValue - (12 * 2)) % 12;
	const octave = (midiValue - pitchClassIndex - 12) / 12;
	return {
		pitchClass: pitchClasses[pitchClassIndex],
		octave,
	};
}

/**
 * Computes the frequency value of the given midi note
 * with custom, optional tuning (default value for
 * tuning is 440 for A4)
 * This curry function will be partially applied if tuning
 * is the only parameter
 * @param {number} tuning - The frequency associated to midi value 69 (A4)
 * @param {number} frequency - Frequency of the note in HZ
 * @returns {number|function} The computed frequency or a computing function
 */
export function frequencyToMidi(tuning = 440, frequency) {
	if (isNil(frequency)) {
		return _ => frequencyToMidi(tuning, _);
	}
	if (frequency >= 8 && frequency < 3952) {
		return 69 + (12 * Math.log2(frequency / tuning));
	}
	return null;
}


/**
 * Computes the frequency value of the given note in the given octave
 * @param {string} pitchClass - Note in scale (english notation)
 * @param {number} octave - Octave value for note
 */
export function symbolToFrequency(pitchClass, octave) {
	return 	midiToFrequency(440, symbolToMidi(pitchClass, octave));
}

/**
 * Computes the note and octave values of the given frequency
 * @param {number} frequency - Octave value for note
 */
export function frequencyToSymbol(frequency) {
	return midiToSymbol(frequencyToMidi(440, frequency));
}
