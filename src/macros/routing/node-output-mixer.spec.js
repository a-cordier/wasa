import test from 'ava'
import sinon from 'sinon'
import { NodeOutputMixer } from './node-output-mixer'
import { AudioContextMock } from '../../mock/audio-context.mock'

test('NodeOutputMixer factory creates an object', (t) => {
	const audioContext = AudioContextMock(sinon.createSandbox())
	const audioNodeMixer = NodeOutputMixer(audioContext)
	t.true(typeof audioNodeMixer === 'object')
})

test('NodeOutputMixer factory creates an object with a fade method', (t) => {
	const audioContext = AudioContextMock(sinon.createSandbox())
	const audioNodeMixer = NodeOutputMixer(audioContext)
	t.true(typeof audioNodeMixer.fade === 'function')
})

test('NodeOutputMixer connect method returns an object with a connect method', (t) => {
	const audioContext = AudioContextMock(sinon.createSandbox())
	const audioNodeMixer = NodeOutputMixer(audioContext)
	const nextInChain = {
		getInput: () => audioContext.createGain(),
		connect() {},
	}
	t.true(typeof audioNodeMixer.connect(nextInChain).connect === 'function')
})

test('NodeOutputMixer connect method returns an object with a left gain node getter', (t) => {
	const audioContext = AudioContextMock(sinon.createSandbox())
	const audioNodeMixer = NodeOutputMixer(audioContext)
	const leftGainNode = audioNodeMixer.getLeftGainNode()
	t.true(typeof leftGainNode === 'object')
})

test('NodeOutputMixer connect method returns an object with a right gain node getter', (t) => {
	const audioContext = AudioContextMock(sinon.createSandbox())
	const audioNodeMixer = NodeOutputMixer(audioContext)
	const rightGainNode = audioNodeMixer.getRightGainNode()
	t.true(typeof rightGainNode === 'object')
})

test('NodeOutputMixer connect method returns an object with a left input setter', (t) => {
	const audioContext = AudioContextMock(sinon.createSandbox())
	const audioNodeMixer = NodeOutputMixer(audioContext)
	const audioNodeMixerLeftInput = audioContext.createOscillator()
	t.true(typeof audioNodeMixer.setLeftInput(audioNodeMixerLeftInput) === 'object')
})

test('NodeOutputMixer connect method returns an object with a right input setter', (t) => {
	const audioContext = AudioContextMock(sinon.createSandbox())
	const audioNodeMixer = NodeOutputMixer(audioContext)
	const audioNodeMixerRightInput = audioContext.createOscillator()
	t.true(typeof audioNodeMixer.setRightInput(audioNodeMixerRightInput) === 'object')
})

test('NodeOutputMixer fade method affects audioContext gains', (t) => {
	const audioContext = AudioContextMock(sinon.createSandbox())
	const audioNodeMixer = NodeOutputMixer(audioContext)
	const gainValues = audioContext.getGainNodes()
		.map(gainNode => gainNode.gain.value)
	audioNodeMixer.fade(1)
	let modified = false
	audioContext.getGainNodes()
		.map(gainNode => gainNode.gain.value)
		.forEach((value, i) => {
			if (value !== gainValues[i]) {
				modified = true
			}
		})
	t.true(modified)
})
