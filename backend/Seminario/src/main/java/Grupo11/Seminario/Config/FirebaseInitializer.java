package Grupo11.Seminario.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class FirebaseInitializer {

    @PostConstruct
    public void initialize() {
        try {
            ClassPathResource serviceAccount = new ClassPathResource("serviceAccountKey.json");

            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                .build();

            FirebaseApp.initializeApp(options);
            System.out.println("Firebase inicializado correctamente.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}



