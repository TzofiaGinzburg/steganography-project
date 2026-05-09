package com.photoServer.steganography.strategies;

import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.ffmpeg.global.avutil;
import org.bytedeco.javacv.FFmpegFrameRecorder;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.bytedeco.javacv.Frame;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.nio.ShortBuffer;
import java.util.Random;

public class VideoGeneratorService {

    public static void main(String[] args) {
        try {
            String path = "src/main/resources/motion_test_with_audio.mp4";
            createHighMotionVideoWithAudio(path, 5);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void createHighMotionVideoWithAudio(String outputPath, int durationSeconds) throws Exception {
        int width = 640;
        int height = 480;
        double fps = 30.0;
        int sampleRate = 44100;
        int totalFrames = (int) (fps * durationSeconds);

        // הגדרת Recorder עם וידאו ואודיו
        FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputPath, width, height, 2); // 2 channels
        recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);
        recorder.setFormat("mp4");
        recorder.setPixelFormat(avutil.AV_PIX_FMT_YUV420P);
        recorder.setFrameRate(fps);
        recorder.setVideoBitrate(2000000);

        // הגדרות אודיו (השמע המטורף)
        recorder.setAudioCodec(avcodec.AV_CODEC_ID_AAC);
        recorder.setSampleRate(sampleRate);
        recorder.setAudioBitrate(128000);

        recorder.start();

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        Java2DFrameConverter converter = new Java2DFrameConverter();
        Random rand = new Random();

        // הגדרת כדורים זזים
        int numBalls = 15;
        int[] ballX = new int[numBalls], ballY = new int[numBalls];
        int[] velX = new int[numBalls], velY = new int[numBalls];
        for (int i = 0; i < numBalls; i++) {
            ballX[i] = rand.nextInt(width); ballY[i] = rand.nextInt(height);
            velX[i] = rand.nextInt(10) + 5; velY[i] = rand.nextInt(10) + 5;
        }

        System.out.println("🎬 Generating high-motion video + audio: " + outputPath);

        // באפר לאודיו (סינוס בתדר משתנה ליצירת אפקט "מטורף")
        short[] audioSamples = new short[sampleRate / (int)fps * 2];

        for (int i = 0; i < totalFrames; i++) {
            // 1. ציור הוידאו
            g.setColor(new Color(20, 20, 40));
            g.fillRect(0, 0, width, height);
            for (int j = 0; j < numBalls; j++) {
                ballX[j] += velX[j]; ballY[j] += velY[j];
                if (ballX[j] < 0 || ballX[j] > width - 30) velX[j] *= -1;
                if (ballY[j] < 0 || ballY[j] > height - 30) velY[j] *= -1;
                g.setColor(new Color(rand.nextInt(255), rand.nextInt(255), rand.nextInt(255)));
                g.fillOval(ballX[j], ballY[j], 30, 30);
            }
            recorder.record(converter.convert(image));

            // 2. יצירת אודיו (גל סינוס שמשנה תדר לפי תנועת הכדורים)
            double freq = 440 + (ballX[0] % 1000);
            for (int s = 0; s < audioSamples.length; s += 2) {
                short sVal = (short) (Math.sin(2 * Math.PI * freq * (i * audioSamples.length + s) / sampleRate) * 32767);
                audioSamples[s] = sVal;     // Left
                audioSamples[s + 1] = sVal; // Right
            }
            recorder.recordSamples(sampleRate, 2, ShortBuffer.wrap(audioSamples));
        }

        g.dispose();
        recorder.stop();
        recorder.release();
        System.out.println("✅ Generated Successfully!");
    }
}