package com.prohire.config;

import com.prohire.model.*;
import com.prohire.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@SuppressWarnings("null")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    private final CategoryRepository categoryRepository;

    private final ProfessionalRepository professionalRepository;

    private final JobRepository jobRepository;

    private final ServiceRepository serviceRepository;

    private final ConnectionRepository connectionRepository;

    private final HireRepository hireRepository;

    private final MessageRepository messageRepository;

    private final PlatformSettingRepository settingRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 5) return; // Allow more than 0 but not if already full

        System.out.println("Initializing Comprehensive ProHire Java Backend Seed Protocol...");

        // 1. Categories
        List<String> categoryNames = Arrays.asList("Web Development", "AI/ML Engineering", "Cybersecurity", "Business Analysis", "Design", "Marketing");
        Map<String, Category> categoryMap = new HashMap<>();
        for (String name : categoryNames) {
            Category cat = Category.builder().name(name).icon("code").description("Professional " + name + " services").build();
            categoryMap.put(name, categoryRepository.save(cat));
        }

        // 2. Professionals & Services
        Professional deepak = createExpert("Deepak Kumar", "deepak@prohire.app", "Expert Full-Stack Developer", 
                "Web Development", Arrays.asList("React", "Node.js", "PostgreSQL", "AWS"), 85.0, categoryMap);
        
        createService(deepak, "Full Stack Web App", "Complete web application development from scratch.", 2500.0, "3-4 Weeks");
        createService(deepak, "API Optimization", "Boost your backend performance and latency.", 800.0, "1 Week");

        Professional carlos = createExpert("Carlos Mendez", "carlos@prohire.app", "Expert AI/ML Engineer", 
                "AI/ML Engineering", Arrays.asList("Python", "TensorFlow", "NLP", "PyTorch"), 110.0, categoryMap);
        
        createService(carlos, "Custom LLM Training", "Training and fine-tuning models for your business.", 5000.0, "1 Month");

        createExpert("Anne Sullivan", "anne@prohire.app", "Expert Cybersecurity Specialist", 
                "Cybersecurity", Arrays.asList("Security", "Penetration Testing", "Compliance"), 100.0, categoryMap);

        // 3. Common Users
        User alice = createUser("Alice Johnson", "alice@example.com", "USER");
        User bob = createUser("Bob Smith", "bob@example.com", "USER");

        // 4. Connections
        createConnection(alice, deepak.getUser(), "ACCEPTED");
        createConnection(bob, carlos.getUser(), "PENDING");

        // 5. Jobs
        createJob("E-Commerce Core Rebuild", "Develop a high-performance e-commerce backbone.", 7500.0, "client@prohire.io");
        createJob("iOS FinTech Application", "Develop a native iOS application with Swift.", 12000.0, "startup@fintech.com");

        // 6. Hires
        createHire(alice, deepak, 2500.0, "ONGOING");

        // 7. Messages
        createMessage(deepak.getUser(), alice, "Hey Alice, I've started working on the dashboard.");
        createMessage(alice, deepak.getUser(), "Great! Looking forward to the update.");

        // 8. Platform Settings
        settingRepository.save(PlatformSetting.builder().settingKey("site_name").settingValue("ProHire Premium").build());
        settingRepository.save(PlatformSetting.builder().settingKey("maintenance_mode").settingValue("false").build());

        // 9. Admin
        User admin = User.builder()
                .email("admin@prohire.app")
                .password(passwordEncoder.encode("admin123"))
                .fullName("System Administrator")
                .role("ADMIN")
                .build();
        userRepository.save(admin);

        System.out.println("Comprehensive ProHire Seed Protocol Complete.");
    }

    private User createUser(String name, String email, String role) {
        if (userRepository.findByEmail(email).isPresent()) return userRepository.findByEmail(email).get();
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode("password123"))
                .fullName(name)
                .role(role)
                .build();
        return userRepository.save(user);
    }

    private Professional createExpert(String name, String email, String title, String category, List<String> skills, Double rate, Map<String, Category> categoryMap) {
        User user = createUser(name, email, "PROFESSIONAL");
        
        if (user.getProfile() == null) {
            Profile profile = Profile.builder().user(user).bio("Expert in " + category).build();
            user.setProfile(profile);
            userRepository.save(user);
        }

        if (professionalRepository.findByUser(user).isPresent()) return professionalRepository.findByUser(user).get();

        Professional pro = Professional.builder()
                .user(user)
                .title(title)
                .category(categoryMap.get(category))
                .rateValue(rate)
                .skills(skills)
                .reviewCount(10)
                .rating(4.5)
                .build();
        return professionalRepository.save(pro);
    }

    private void createService(Professional pro, String name, String desc, Double price, String duration) {
        Service service = Service.builder()
                .professional(pro)
                .name(name)
                .description(desc)
                .price(price)
                .duration(duration)
                .build();
        serviceRepository.save(service);
    }

    private void createConnection(User sender, User receiver, String status) {
        Connection conn = Connection.builder()
                .sender(sender)
                .receiver(receiver)
                .status(status)
                .build();
        connectionRepository.save(conn);
    }

    private void createHire(User client, Professional pro, Double amount, String status) {
        Hire hire = Hire.builder()
                .clientUser(client)
                .professional(pro)
                .amountValue(amount)
                .status(status)
                .build();
        hireRepository.save(hire);
    }

    private void createMessage(User sender, User receiver, String content) {
        Message msg = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();
        messageRepository.save(msg);
    }

    private void createJob(String title, String desc, Double budget, String clientEmail) {
        User client = createUser("Client Node", clientEmail, "USER");

        Job job = Job.builder()
                .title(title)
                .description(desc)
                .budget(budget)
                .poster(client)
                .status("OPEN")
                .build();
        jobRepository.save(job);
    }
}
