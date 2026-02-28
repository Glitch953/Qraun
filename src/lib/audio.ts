/**
 * Audio engine using Web Audio API to synthesize realistic sounds
 * No external files needed — everything is generated in the browser
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

// ─────────────────────────────────
// White / Brown noise generator
// ─────────────────────────────────
function createNoiseBuffer(ctx: AudioContext, duration: number, type: "white" | "brown" = "white"): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    if (type === "white") {
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    } else {
        // Brown noise (more natural, low-rumble wind)
        let last = 0;
        for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (last + 0.02 * white) / 1.02;
            last = data[i];
            data[i] *= 3.5;
        }
    }
    return buffer;
}

// ─────────────────────────────────
// Ambient wind / mosque atmosphere
// ─────────────────────────────────
export function playAmbient(volume = 0.12): { stop: () => void; gainNode: GainNode } {
    const ctx = getCtx();

    // Brown noise for wind
    const noiseBuffer = createNoiseBuffer(ctx, 4, "brown");
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Low-pass filter for soft wind
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 400;
    lpf.Q.value = 0.5;

    // Gentle volume modulation (LFO) for breathing wind effect
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.15; // Very slow
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = volume * 0.3;
    lfo.connect(lfoGain);

    const gain = ctx.createGain();
    gain.gain.value = volume;
    lfoGain.connect(gain.gain);

    noise.connect(lpf);
    lpf.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    lfo.start();

    // Add subtle high-frequency sparkle (birds-like distant chirps)
    const sparkleOsc = ctx.createOscillator();
    sparkleOsc.type = "sine";
    sparkleOsc.frequency.value = 3200;
    const sparkleGain = ctx.createGain();
    sparkleGain.gain.value = 0;
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkleOsc.start();

    // Random chirp scheduler
    const chirpInterval = setInterval(() => {
        const now = ctx.currentTime;
        sparkleOsc.frequency.setValueAtTime(2800 + Math.random() * 1200, now);
        sparkleGain.gain.setValueAtTime(0, now);
        sparkleGain.gain.linearRampToValueAtTime(volume * 0.04, now + 0.05);
        sparkleGain.gain.linearRampToValueAtTime(0, now + 0.15);
    }, 2000 + Math.random() * 3000);

    return {
        gainNode: gain,
        stop: () => {
            clearInterval(chirpInterval);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            setTimeout(() => {
                try { noise.stop(); sparkleOsc.stop(); lfo.stop(); } catch { }
            }, 600);
        },
    };
}

// ─────────────────────────────────
// Door creak / opening sound
// ─────────────────────────────────
export function playDoorOpen(volume = 0.5): void {
    const ctx = getCtx();

    // Filtered noise sweep for the creak
    const noiseBuffer = createNoiseBuffer(ctx, 3, "white");
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.value = 300;
    bpf.Q.value = 8;

    // Frequency sweep upward (creak feel)
    const now = ctx.currentTime;
    bpf.frequency.setValueAtTime(200, now);
    bpf.frequency.exponentialRampToValueAtTime(600, now + 1.5);
    bpf.frequency.exponentialRampToValueAtTime(250, now + 3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume * 0.6, now + 0.3);
    gain.gain.linearRampToValueAtTime(volume * 0.3, now + 1.5);
    gain.gain.linearRampToValueAtTime(volume * 0.5, now + 2);
    gain.gain.linearRampToValueAtTime(0, now + 3.5);

    noise.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(now + 3.5);

    // Deep thud (heavy wooden door base)
    const thud = ctx.createOscillator();
    thud.type = "sine";
    thud.frequency.setValueAtTime(80, now);
    thud.frequency.exponentialRampToValueAtTime(40, now + 1);
    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(volume * 0.4, now);
    thudGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 1.5);

    // Secondary creak layer
    const creak2 = ctx.createOscillator();
    creak2.type = "sawtooth";
    creak2.frequency.setValueAtTime(150, now + 0.5);
    creak2.frequency.exponentialRampToValueAtTime(400, now + 2);
    creak2.frequency.exponentialRampToValueAtTime(180, now + 3);
    const creak2Gain = ctx.createGain();
    creak2Gain.gain.setValueAtTime(0, now + 0.5);
    creak2Gain.gain.linearRampToValueAtTime(volume * 0.08, now + 1);
    creak2Gain.gain.linearRampToValueAtTime(0, now + 3);
    const creak2Filter = ctx.createBiquadFilter();
    creak2Filter.type = "bandpass";
    creak2Filter.frequency.value = 350;
    creak2Filter.Q.value = 12;
    creak2.connect(creak2Filter);
    creak2Filter.connect(creak2Gain);
    creak2Gain.connect(ctx.destination);
    creak2.start(now + 0.5);
    creak2.stop(now + 3);
}

// ─────────────────────────────────
// Spiritual background tone (pad)
// ─────────────────────────────────
export function playSpiritualTone(volume = 0.15): { stop: () => void; gainNode: GainNode } {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volume, now + 3);
    masterGain.connect(ctx.destination);

    // Root note D3 (146.83 Hz) — spiritual, warm
    const freqs = [146.83, 220, 293.66, 440];

    const oscillators: OscillatorNode[] = [];

    freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;

        // Slight detuning for richness
        osc.detune.value = (Math.random() - 0.5) * 8;

        const oscGain = ctx.createGain();
        oscGain.gain.value = (volume / freqs.length) * (1 - i * 0.15);

        // Slow tremolo per voice
        const trem = ctx.createOscillator();
        trem.type = "sine";
        trem.frequency.value = 0.1 + i * 0.05;
        const tremGain = ctx.createGain();
        tremGain.gain.value = oscGain.gain.value * 0.3;
        trem.connect(tremGain);
        tremGain.connect(oscGain.gain);
        trem.start();

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscillators.push(osc);
    });

    // Add a reverb-like effect using delay feedback
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.3;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 800;

    masterGain.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delay.connect(ctx.destination);

    return {
        gainNode: masterGain,
        stop: () => {
            const t = ctx.currentTime;
            masterGain.gain.linearRampToValueAtTime(0, t + 2);
            setTimeout(() => {
                oscillators.forEach((o) => { try { o.stop(); } catch { } });
            }, 2200);
        },
    };
}
