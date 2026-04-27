package com.prohire.config;

import com.prohire.model.User;
import com.prohire.model.Profile;
import com.prohire.model.Category;
import com.prohire.model.Professional;
import com.prohire.model.Service;
import com.prohire.model.Job;
import com.prohire.model.Hire;
import com.prohire.model.Message;
import com.prohire.model.Connection;
import com.prohire.model.Share;
import com.prohire.model.PlatformSetting;
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

        Category mobileCat = categoryRepository.findByName("Mobile Development")
            .orElse(Category.builder().name("Mobile Development").build());
        mobileCat.setDescription("Native and Cross-platform Mobile Apps");
        mobileCat.setIcon("📱");

        Category cloudCat = categoryRepository.findByName("Cloud Computing")
            .orElse(Category.builder().name("Cloud Computing").build());
        cloudCat.setDescription("AWS, Azure, and Google Cloud Solutions");
        cloudCat.setIcon("☁️");

        Category cyberCat = categoryRepository.findByName("Cybersecurity")
            .orElse(Category.builder().name("Cybersecurity").build());
        cyberCat.setDescription("Network Security and Penetration Testing");
        cyberCat.setIcon("🛡️");

        categoryRepository.saveAll(List.of(webCat, designCat, aiCat, mobileCat, cloudCat, cyberCat));
        categoryRepository.flush();

        // 5. PROFESSIONAL PROFILE
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

        // 5.1 ADDITIONAL PROFESSIONALS
        User pro2User = userRepository.findByEmail("pro2@klu.in")
            .orElse(User.builder().email("pro2@klu.in").build());
        pro2User.setPassword(encodedPassword);
        pro2User.setFullName("Sneha Mobile");
        pro2User.setRole("PROFESSIONAL");
        pro2User.setProfileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha");
        pro2User.setIsEmailVerified(true);
        Profile pro2Profile = pro2User.getProfile();
        if (pro2Profile == null) {
            pro2Profile = Profile.builder().user(pro2User).build();
            pro2User.setProfile(pro2Profile);
        }
        pro2Profile.setBio("Specialist in Flutter and React Native development with 5 years experience.");
        pro2Profile.setLocation("Hyderabad, India");
        userRepository.save(pro2User);

        Professional pro2 = Professional.builder()
            .user(pro2User)
            .category(mobileCat)
            .title("Senior Mobile Architect")
            .rateValue(120.0)
            .skills(List.of("Flutter", "Dart", "Swift", "Kotlin", "Firebase"))
            .rating(4.8)
            .reviewCount(85)
            .build();
        professionalRepository.save(pro2);

        User pro3User = userRepository.findByEmail("pro3@klu.in")
            .orElse(User.builder().email("pro3@klu.in").build());
        pro3User.setPassword(encodedPassword);
        pro3User.setFullName("Rahul Cloud");
        pro3User.setRole("PROFESSIONAL");
        pro3User.setProfileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul");
        pro3User.setIsEmailVerified(true);
        Profile pro3Profile = pro3User.getProfile();
        if (pro3Profile == null) {
            pro3Profile = Profile.builder().user(pro3User).build();
            pro3User.setProfile(pro3Profile);
        }
        pro3Profile.setBio("AWS Certified Solutions Architect helping businesses move to the cloud.");
        pro3Profile.setLocation("Pune, India");
        userRepository.save(pro3User);

        Professional pro3 = Professional.builder()
            .user(pro3User)
            .category(cloudCat)
            .title("Cloud Solutions Architect")
            .rateValue(180.0)
            .skills(List.of("AWS", "Kubernetes", "Terraform", "Docker", "DevOps"))
            .rating(4.9)
            .reviewCount(42)
            .build();
        professionalRepository.save(pro3);

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

        // 6.1 ADDITIONAL SERVICES
        Service s3 = Service.builder()
            .professional(pro2)
            .name("Cross-Platform Mobile App")
            .description("Build once, deploy to both iOS and Android with Flutter.")
            .price(4000.0)
            .priceLabel("$4000 Fixed")
            .duration("3 Weeks")
            .build();
        Service s4 = Service.builder()
            .professional(pro3)
            .name("Cloud Infrastructure Setup")
            .description("Complete AWS infrastructure setup with IaC using Terraform.")
            .price(150.0)
            .priceLabel("$150/hr")
            .duration("2 Weeks")
            .build();
        serviceRepository.saveAll(List.of(s3, s4));

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

        // 7.1 ADDITIONAL JOBS
        Job j3 = Job.builder()
            .poster(client)
            .title("Crypto Wallet Development")
            .description("Looking for a developer to build a secure non-custodial crypto wallet.")
            .location("Remote")
            .type("FULL_TIME")
            .budget(15000.0)
            .category("Cybersecurity")
            .skills(List.of("Solidity", "Web3.js", "Cryptography", "React"))
            .status("OPEN")
            .build();
        Job j4 = Job.builder()
            .poster(admin)
            .title("Infrastructure Migration")
            .description("Need help migrating our on-premise servers to AWS.")
            .location("Remote")
            .type("CONTRACT")
            .budget(10000.0)
            .category("Cloud Computing")
            .skills(List.of("AWS", "Migration", "Linux"))
            .status("OPEN")
            .build();
        jobRepository.saveAll(List.of(j3, j4));

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

        Hire h2 = Hire.builder()
            .clientUser(client)
            .professional(pro2)
            .service(s3)
            .serviceTitle(s3.getName())
            .amountValue(4000.0)
            .notes("Working on UI wireframes.")
            .progress(10)
            .status("ONGOING")
            .build();
        hireRepository.save(h2);

        // 9. MESSAGES
        Message m1 = Message.builder()
            .sender(client)
            .receiver(proUser)
            .content("Hi Ankit, can you provide an update on the dashboard?")
            .isRead(true)
            .build();
        Message m2 = Message.builder()
            .sender(proUser)
            .receiver(client)
            .content("Yes Suresh, I'll send the report by EOD.")
            .isRead(false)
            .build();
        messageRepository.saveAll(List.of(m1, m2));

        // 10. CONNECTIONS
        Connection c1 = Connection.builder()
            .sender(client)
            .receiver(pro2User)
            .status("ACCEPTED")
            .build();
        Connection c2 = Connection.builder()
            .sender(pro3User)
            .receiver(admin)
            .status("PENDING")
            .build();
        connectionRepository.saveAll(List.of(c1, c2));

        // 11. SHARES
        Share sh1 = Share.builder()
            .title("ProHire Platform Launch")
            .url("https://prohire.klu.in/launch")
            .build();
        Share sh2 = Share.builder()
            .title("Top Web Development Trends 2026")
            .url("https://prohire.klu.in/blog/web-trends-2026")
            .build();
        shareRepository.saveAll(List.of(sh1, sh2));

        // 12. PLATFORM SETTINGS
        platformSettingRepository.save(PlatformSetting.builder()
            .settingKey("platform_fee")
            .settingValue("10")
            .build());
        platformSettingRepository.save(PlatformSetting.builder()
            .settingKey("maintenance_mode")
            .settingValue("false")
            .build());
    }
}
