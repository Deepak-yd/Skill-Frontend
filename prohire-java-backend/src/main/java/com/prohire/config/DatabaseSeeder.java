package com.prohire.config;

import com.prohire.model.User;
import com.prohire.model.Profile;
import com.prohire.model.Category;
import com.prohire.model.Professional;
import com.prohire.model.Service;
import com.prohire.model.Job;
import com.prohire.model.Hire;
import com.prohire.repository.UserRepository;
import com.prohire.repository.ProfessionalRepository;
import com.prohire.repository.JobRepository;
import com.prohire.repository.CategoryRepository;
import com.prohire.repository.ServiceRepository;
import com.prohire.repository.HireRepository;
import com.prohire.repository.MessageRepository;
import com.prohire.repository.ConnectionRepository;
import com.prohire.repository.ShareRepository;
import com.prohire.repository.PlatformSettingRepository;
import com.prohire.repository.ProfileRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceRepository serviceRepository;
    private final HireRepository hireRepository;
    private final MessageRepository messageRepository;
    private final ConnectionRepository connectionRepository;
    private final ShareRepository shareRepository;
    private final PlatformSettingRepository platformSettingRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(String... args) throws Exception {
        System.out.println("🚀 Initializing Fresh ProHire Database Seed Protocol...");

        // 0. CLEAR EXISTING DATA (In correct order to avoid FK violations)
        hireRepository.deleteAllInBatch();
        messageRepository.deleteAllInBatch();
        connectionRepository.deleteAllInBatch();
        serviceRepository.deleteAllInBatch();
        jobRepository.deleteAllInBatch();
        professionalRepository.deleteAllInBatch();
        shareRepository.deleteAllInBatch();
        platformSettingRepository.deleteAllInBatch();
        profileRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
        categoryRepository.deleteAllInBatch();

        String encodedPassword = passwordEncoder.encode("password123");

        // 1. ADMIN USER
        User admin = userRepository.findByEmail("admin@klu.in")
            .orElse(User.builder().email("admin@klu.in").build());
        admin.setPassword(encodedPassword);
        admin.setFullName("Deepak Admin");
        admin.setRole("ADMIN");
        admin.setProfileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=Admin");
        admin.setIsEmailVerified(true);
        
        Profile adminProfile = admin.getProfile();
        if (adminProfile == null) {
            adminProfile = Profile.builder().user(admin).build();
            admin.setProfile(adminProfile);
        }
        adminProfile.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Admin");
        adminProfile.setBio("Lead Platform Administrator at ProHire. Managing core operations and security.");
        adminProfile.setLocation("Vijayawada, India");
        adminProfile.setCompany("KLU Global");
        adminProfile.setWebsite("https://admin.klu.in");
        adminProfile.setPhone("+91 99999 88888");
        adminProfile.setLinkedIn("linkedin.com/in/deepak-admin");
        adminProfile.setGithub("github.com/deepak-admin");
        adminProfile.setTwitter("@deepak_admin");
        adminProfile.setPortfolio("https://portfolio.klu.in/admin");
        userRepository.save(admin);

        // 2. CLIENT USER
        User client = userRepository.findByEmail("client@klu.in")
            .orElse(User.builder().email("client@klu.in").build());
        client.setPassword(encodedPassword);
        client.setFullName("Suresh Client");
        client.setRole("USER");
        client.setProfileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh");
        client.setIsEmailVerified(true);

        Profile clientProfile = client.getProfile();
        if (clientProfile == null) {
            clientProfile = Profile.builder().user(client).build();
            client.setProfile(clientProfile);
        }
        clientProfile.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh");
        clientProfile.setBio("Startup founder looking for top-tier professional talent to build the next unicorn.");
        clientProfile.setLocation("Hyderabad, India");
        clientProfile.setCompany("KLU Innovations");
        clientProfile.setWebsite("https://startup.klu.in");
        clientProfile.setPhone("+91 77777 66666");
        clientProfile.setLinkedIn("linkedin.com/in/suresh-client");
        clientProfile.setGithub("github.com/suresh-client");
        clientProfile.setTwitter("@suresh_innovates");
        clientProfile.setPortfolio("https://portfolio.klu.in/suresh");
        userRepository.save(client);

        // 3. PROFESSIONAL USER
        User proUser = userRepository.findByEmail("pro@klu.in")
            .orElse(User.builder().email("pro@klu.in").build());
        proUser.setPassword(encodedPassword);
        proUser.setFullName("Ankit Professional");
        proUser.setRole("PROFESSIONAL");
        proUser.setProfileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit");
        proUser.setIsEmailVerified(true);

        Profile proProfile = proUser.getProfile();
        if (proProfile == null) {
            proProfile = Profile.builder().user(proUser).build();
            proUser.setProfile(proProfile);
        }
        proProfile.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit");
        proProfile.setBio("Expert Full-Stack Developer with 8+ years of experience in Java, Spring, and React.");
        proProfile.setLocation("Bangalore, India");
        proProfile.setCompany("Ankit Tech Solutions");
        proProfile.setWebsite("https://ankit.dev");
        proProfile.setPhone("+91 88888 77777");
        proProfile.setLinkedIn("linkedin.com/in/ankit-pro");
        proProfile.setGithub("github.com/ankit-dev");
        proProfile.setTwitter("@ankit_codes");
        proProfile.setPortfolio("https://ankit.dev/portfolio");
        userRepository.save(proUser);

        // 4. CATEGORIES (Find-or-Create to prevent Duplicate Entry errors)
        Category webCat = categoryRepository.findByName("Web Development")
            .orElse(Category.builder().name("Web Development").build());
        webCat.setDescription("Frontend, Backend, and Full Stack Solutions");
        webCat.setIcon("🌐");
        
        Category designCat = categoryRepository.findByName("UI/UX Design")
            .orElse(Category.builder().name("UI/UX Design").build());
        designCat.setDescription("User Interface and Experience Design");
        designCat.setIcon("🎨");
        
        Category aiCat = categoryRepository.findByName("AI & ML")
            .orElse(Category.builder().name("AI & ML").build());
        aiCat.setDescription("Artificial Intelligence and Machine Learning Models");
        aiCat.setIcon("🤖");

        categoryRepository.saveAll(List.of(webCat, designCat, aiCat));
        categoryRepository.flush();

        // 5. PROFESSIONAL PROFILE
        Professional professional = Professional.builder()
            .user(proUser)
            .category(webCat)
            .title("Senior Full-Stack Architect")
            .rateValue(150.0)
            .skills(List.of("Java", "Spring Boot", "React", "Docker", "AWS", "MySQL"))
            .rating(5.0)
            .reviewCount(120)
            .build();
        professionalRepository.save(professional);

        // 6. SERVICES
        Service s1 = Service.builder()
            .professional(professional)
            .name("Enterprise Web Application")
            .description("Complete end-to-end web application development using Spring Boot and React.")
            .price(5000.0)
            .priceLabel("$5000 Fixed")
            .duration("4 Weeks")
            .build();
        Service s2 = Service.builder()
            .professional(professional)
            .name("Performance Optimization")
            .description("Audit and optimize your existing backend for maximum throughput.")
            .price(100.0)
            .priceLabel("$100/hr")
            .duration("1 Week")
            .build();
        serviceRepository.save(s1);
        serviceRepository.save(s2);

        // 7. JOBS
        Job j1 = Job.builder()
            .poster(client)
            .title("Scale-up Backend for Fintech")
            .description("We need an expert to help us scale our banking API to 10k requests per second.")
            .location("Remote")
            .type("CONTRACT")
            .budget(8000.0)
            .category("Web Development")
            .skills(List.of("Java", "Redis", "Kafka", "Microservices"))
            .status("OPEN")
            .build();
        Job j2 = Job.builder()
            .poster(admin)
            .title("Internal Dashboard Design")
            .description("Design a clean, premium dashboard for platform analytics.")
            .location("Vijayawada")
            .type("PART_TIME")
            .budget(3000.0)
            .category("UI/UX Design")
            .skills(List.of("Figma", "Canva", "Tailwind"))
            .status("OPEN")
            .build();
        jobRepository.save(j1);
        jobRepository.save(j2);

        // 8. HIRES
        Hire h1 = Hire.builder()
            .clientUser(client)
            .professional(professional)
            .service(s1)
            .serviceTitle(s1.getName())
            .amountValue(5000.0)
            .notes("Initial project kickoff completed. Designing the system architecture.")
            .progress(25)
            .status("ONGOING")
            .build();
        hireRepository.save(h1);

        System.out.println("✅ Database Seeded Successfully with 3 Core @klu.in Users and Full Details!");
    }
}
