package com.photoServer.steganography.factory;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.SteganoStrategy; // וודא שה-path נכון
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SteganoFactory implements InitializingBean {

    @Autowired
    private List<SteganoStrategy> allStrategies;

    @Autowired
    private SteganoRouter router;

    private final Map<MediaType, List<SteganoStrategy>> registry = new EnumMap<>(MediaType.class);

    @Override
    public void afterPropertiesSet() {
        for (SteganoStrategy strategy : allStrategies) {
            registry.computeIfAbsent(strategy.getSupportedType(), k -> new ArrayList<>())
                    .add(strategy);
        }
    }
    public SteganoStrategy getStrategy(String name) {
        return allStrategies.stream()
                .filter(s -> s.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Strategy not found: " + name));
    }
    public SteganoStrategy getOptimalStrategy(FileMetrics metrics) {
        // מקבל את השם מהראוטר (למשל "PvdImage")
        String targetName = router.decideAlgorithm(metrics);

        return allStrategies.stream()
                .filter(s -> s.getClass().getSimpleName().equalsIgnoreCase(targetName) ||
                        s.getClass().getSimpleName().equalsIgnoreCase(targetName + "Strategy"))
                .findFirst()
                .orElseGet(() -> {
                    // Fallback: אם הראוטר החזיר משהו שלא נמצא, בוחרים לפי הציון הגבוה ביותר
                    return registry.get(metrics.type()).stream()
                            .max(Comparator.comparingInt(s -> s.calculateSuitability(metrics)))
                            .orElseThrow(() -> new RuntimeException("No strategy found for type: " + metrics.type()));
                });
    }
}