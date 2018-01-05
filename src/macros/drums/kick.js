export const Kick = (audioContext) => {
	const output = audioContext.createGain()
	const mainOscGain = audioContext.createGain()
	mainOscGain.connect(output)
	let mainOsc
	let initialFrequency = 150
	let duration = 0.15
	let on = false
	let muted = false
	let outputGainValue = 1E-10
	const finalFrequency = 0.01

	output.gain.value = outputGainValue
	mainOscGain.gain.value = 1E-10

	return {
		noteOn(time = audioContext.currentTime, velocity = 1) {
			mainOsc = audioContext.createOscillator()
			mainOsc.type = 'triangle'
			mainOsc.frequency.setValueAtTime(initialFrequency, time)
			mainOscGain.gain.setValueAtTime(velocity, time)
			mainOscGain.gain.exponentialRampToValueAtTime(0.01, time + duration)
			mainOsc.frequency.exponentialRampToValueAtTime(finalFrequency, time + duration)
			mainOsc.start(time)
			mainOsc.stop(time + duration)
			mainOsc.connect(mainOscGain)
			on = true
		},
		noteOff(time = audioContext.currentTime + duration) {
			if (!on) {
				return
			}
			mainOsc.frequency.exponentialRampToValueAtTime(finalFrequency, time)
			mainOscGain.gain.exponentialRampToValueAtTime(1E-10, time)
			mainOsc.stop(time)
			on = false
		},
		connect({ connect, getInput }) {
			output.connect(getInput())
			return { connect }
		},
		setFrequencyValue(value) {
			initialFrequency = value
			return this
		},
		getFrequencyValue() {
			return initialFrequency
		},
		setDurationValue(value) {
			duration = value
			return this
		},
		getDurationValue() {
			return duration
		},
		setOutputGainValue(value) {
			outputGainValue = value
			if (!muted) {
				output.gain.value = outputGainValue
			}
			return this
		},
		getOutputGainValue() {
			return outputGainValue
		},
		mute() {
			muted = true
			output.gain.value = 1E-10
		},
		unMute() {
			output.gain.value = outputGainValue
			muted = false
		},
	}
}
