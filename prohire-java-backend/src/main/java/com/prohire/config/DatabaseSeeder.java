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
        userRepository.deleteAllInBatch();
        categoryRepository.deleteAllInBatch();

        String encodedPassword = passwordEncoder.encode("password123");

        // 1. ADMIN USER
        User admin = User.builder()
            .email("admin@klu.in")
            .password(encodedPassword)
            .fullName("Deepak Admin")
            .role("ADMIN")
            .profileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=Admin")
            .isEmailVerified(true)
            .build();
        Profile adminProfile = Profile.builder()
            .user(admin)
            .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Admin")
            .bio("Lead Platform Administrator at ProHire. Managing core operations and security.")
            .location("Vijayawada, India")
            .company("KLU Global")
            .website("https://admin.klu.in")
            .phone("+91 99999 88888")
            .linkedIn("linkedin.com/in/deepak-admin")
            .github("github.com/deepak-admin")
            .twitter("@deepak_admin")
            .portfolio("https://portfolio.klu.in/admin")
            .build();
        admin.setProfile(adminProfile);
        userRepository.save(admin);

        // 2. CLIENT USER
        User client = User.builder()
            .email("client@klu.in")
            .password(encodedPassword)
            .fullName("Suresh Client")
            .role("USER")
            .profileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh")
            .isEmailVerified(true)
            .build();
        Profile clientProfile = Profile.builder()
            .user(client)
            .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh")
            .bio("Startup founder looking for top-tier professional talent to build the next unicorn.")
            .location("Hyderabad, India")
            .company("KLU Innovations")
            .website("https://startup.klu.in")
            .phone("+91 77777 66666")
            .linkedIn("linkedin.com/in/suresh-client")
            .github("github.com/suresh-client")
            .twitter("@suresh_innovates")
            .portfolio("https://portfolio.klu.in/suresh")
            .build();
        client.setProfile(clientProfile);
        userRepository.save(client);

        // 3. PROFESSIONAL USER
        User proUser = User.builder()
            .email("pro@klu.in")
            .password(encodedPassword)
            .fullName("Ankit Professional")
            .role("PROFESSIONAL")
            .profileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit")
            .isEmailVerified(true)
            .build();
        Profile proProfile = Profile.builder()
            .user(proUser)
            .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit")
            .bio("Expert Full-Stack Developer with 8+ years of experience in Java, Spring, and React.")
            .location("Bangalore, India")
            .company("Ankit Tech Solutions")
            .website("https://ankit.dev")
            .phone("+91 88888 77777")
            .linkedIn("linkedin.com/in/ankit-pro")
            .github("github.com/ankit-dev")
            .twitter("@ankit_codes")
            .portfolio("https://ankit.dev/portfolio")
            .build();
        proUser.setProfile(proProfile);
        userRepository.save(proUser);

        // 4. CATEGORIES
        Category webCat = Category.builder().name("Web Development").description("Frontend, Backend, and Full Stack Solutions").icon("🌐").build();
        Category designCat = Category.builder().name("UI/UX Design").description("User Interface and Experience Design").icon("🎨").build();
        Category aiCat = Category.builder().name("AI & ML").description("Artificial Intelligence and Machine Learning Models").icon("🤖").build();
        categoryRepository.save(webCat);
        categoryRepository.save(designCat);
        categoryRepository.save(aiCat);

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
