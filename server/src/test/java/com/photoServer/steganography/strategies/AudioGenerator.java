package com.photoServer.steganography.strategies;

import javax.sound.sampled.*;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Random;


    public class AudioGenerator {

        public static void generateComplexAudio(String fileName, int durationSeconds) {
            float sampleRate = 44100;
            int numSamples = (int) (sampleRate * durationSeconds);
            short[] samples = new short[numSamples];

            System.out.println("🎸 מייצר סאונד עשיר בתדרים (Magnitude Spectrum Target)...");

            for (int i = 0; i < numSamples; i++) {
                double t = i / sampleRate;

                // 1. מקצב בסיס (Kick Drum) - יוצר RMS גבוה
                double beat = Math.sin(2 * Math.PI * 50 * t) * Math.exp(-5 * (t % 0.5));

                // 2. שכבת אקורדים עשירה (עושר תדרים)
                double chord = Math.sin(2 * Math.PI * 220 * t) +
                        Math.sin(2 * Math.PI * 440 * t) +
                        Math.sin(2 * Math.PI * 660 * t);

                // 3. אפקט "מטורף" משתנה (FM Synthesis קלה)
                double modulation = Math.sin(2 * Math.PI * (100 + 500 * Math.sin(2 * Math.PI * 0.5 * t)) * t);

                // שילוב עוצמות ליצירת RMS > 0.20
                double combined = (0.4 * beat) + (0.3 * chord) + (0.2 * modulation);

                // Clipping protection
                samples[i] = (short) (Math.max(-1.0, Math.min(1.0, combined)) * 32767);
            }

            saveWav(fileName, samples, (int) sampleRate);
        }

        private static void saveWav(String fileName, short[] samples, int sampleRate) {
            byte[] byteData = new byte[samples.length * 2];
            ByteBuffer.wrap(byteData).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().put(samples);

            AudioFormat format = new AudioFormat(sampleRate, 16, 1, true, false);
            try (ByteArrayInputStream bais = new ByteArrayInputStream(byteData);
                 AudioInputStream ais = new AudioInputStream(bais, format, samples.length)) {
                AudioSystem.write(ais, AudioFileFormat.Type.WAVE, new File(fileName));
                System.out.println("✅ קובץ נוצר בהצלחה: " + new File(fileName).getAbsolutePath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        public static void main(String[] args) {
            // יוצר קובץ של 20 שניות בנתיב המשאבים של הפרויקט
            generateComplexAudio("src/main/resources/complex_magnitude_base.wav", 20);
        }
    }