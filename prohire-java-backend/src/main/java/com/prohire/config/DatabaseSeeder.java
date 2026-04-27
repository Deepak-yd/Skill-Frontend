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
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping...");
            return;
        }

        System.out.println("Initializing Comprehensive ProHire Database Seed Protocol...");

        // 1. ADMIN USER
        User admin = User.builder()
            .email("admin@klu.in")
            .password(passwordEncoder.encode("password"))
            .fullName("System Administrator")
            .role("ADMIN")
            .isEmailVerified(true)
            .build();
        Profile adminProfile = Profile.builder()
            .user(admin)
            .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Admin")
            .bio("Lead System Overseer at ProHire HQ.")
            .location("Vijayawada, India")
            .company("ProHire Global")
            .website("https://prohire.klu.in")
            .phone("+91 9999999999")
            .linkedIn("linkedin.com/in/prohire-admin")
            .github("github.com/prohire-hq")
            .build();
        admin.setProfile(adminProfile);
        userRepository.save(admin);

        // 2. CLIENT USER
        User client = User.builder()
            .email("client@klu.in")
            .password(passwordEncoder.encode("password"))
            .fullName("Sarah Connor")
            .role("USER")
            .isEmailVerified(true)
            .build();
        Profile clientProfile = Profile.builder()
            .user(client)
            .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah")
            .bio("Product Manager specializing in futuristic tech and AI safety.")
            .location("Los Angeles, USA")
            .company("Cyberdyne Systems")
            .website("https://cyberdyne.io")
            .phone("+1 555-0199")
            .twitter("@sconnor_pm")
            .github("sconnor-dev")
            .build();
        client.setProfile(clientProfile);
        userRepository.save(client);

        // 3. PROFESSIONAL 1 - Full Stack
        User pro1User = User.builder()
            .email("pro1@klu.in")
            .password(passwordEncoder.encode("password"))
            .fullName("Alex Vance")
            .role("PROFESSIONAL")
            .isEmailVerified(true)
            .build();
        Profile pro1Profile = Profile.builder()
            .user(pro1User)
            .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex")
            .bio("Senior Full-Stack Architect with a passion for high-performance distributed systems.")
            .location("San Francisco, CA")
            .company("Freelance Node")
            .website("https://alexvance.dev")
            .portfolio("https://portfolio.alexvance.dev")
            .github("alexv-code")
            .linkedIn("linkedin.com/in/alexvance")
            .phone("+1 415-555-2671")
            .build();
        pro1User.setProfile(pro1Profile);
        userRepository.save(pro1User);

        // 4. PROFESSIONAL 2 - UI/UX
        User pro2User = User.builder()
            .email("pro2@klu.in")
            .password(passwordEncoder.encode("password"))
            .fullName("Elena Fisher")
            .role("PROFESSIONAL")
            .isEmailVerified(true)
            .build();
        Profile pro2Profile = Profile.builder()
            .user(pro2User)
            .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Elena")
            .bio("Award-winning UI/UX Designer creating immersive digital experiences.")
            .location("London, UK")
            .company("Elena Designs")
            .website("https://elenafisher.design")
            .portfolio("https://dribbble.com/elena")
            .twitter("@elenaf_ux")
            .phone("+44 20 7946 0958")
            .build();
        pro2User.setProfile(pro2Profile);
        userRepository.save(pro2User);

        // 5. PROFESSIONAL 3 - AI/ML
        User pro3User = User.builder()
            .email("pro3@klu.in")
            .password(passwordEncoder.encode("password"))
            .fullName("Deepak Kumar")
            .role("PROFESSIONAL")
            .isEmailVerified(true)
            .build();
        Profile pro3Profile = Profile.builder()
            .user(pro3User)
            .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak")
            .bio("AI Specialist focused on LLMs and Generative Models.")
            .location("Bangalore, India")
            .company("DeepMind Labs")
            .github("deepak-ai")
            .linkedIn("linkedin.com/in/deepak-ai-ml")
            .phone("+91 88888 88888")
            .build();
        pro3User.setProfile(pro3Profile);
        userRepository.save(pro3User);

        // CATEGORIES
        Category webCat = Category.builder().name("Web Development").description("Frontend, Backend, and Full Stack").icon("🌐").build();
        Category designCat = Category.builder().name("UI/UX Design").description("User Interface and Experience").icon("🎨").build();
        Category aiCat = Category.builder().name("AI & Machine Learning").description("Models, LLMs, and Data Science").icon("🤖").build();
        Category mobileCat = Category.builder().name("Mobile Apps").description("iOS and Android Development").icon("📱").build();
        Category cyberCat = Category.builder().name("Cybersecurity").description("Penetration Testing and Security Audits").icon("🛡️").build();
        categoryRepository.save(webCat);
        categoryRepository.save(designCat);
        categoryRepository.save(aiCat);
        categoryRepository.save(mobileCat);
        categoryRepository.save(cyberCat);

        // PROFESSIONALS (Expert Profiles)
        Professional pro1 = Professional.builder()
            .user(pro1User)
            .category(webCat)
            .title("Senior Backend Architect")
            .rateValue(120.0)
            .skills(List.of("Java", "Spring Boot", "AWS", "Docker", "Kubernetes"))
            .rating(4.95)
            .reviewCount(142)
            .build();
        professionalRepository.save(pro1);

        Professional pro2 = Professional.builder()
            .user(pro2User)
            .category(designCat)
            .title("Lead UI/UX Designer")
            .rateValue(95.0)
            .skills(List.of("Figma", "Adobe XD", "Prototyping", "User Research"))
            .rating(5.0)
            .reviewCount(88)
            .build();
        professionalRepository.save(pro2);

        Professional pro3 = Professional.builder()
            .user(pro3User)
            .category(aiCat)
            .title("AI Solutions Engineer")
            .rateValue(150.0)
            .skills(List.of("Python", "PyTorch", "OpenAI API", "LangChain"))
            .rating(4.8)
            .reviewCount(56)
            .build();
        professionalRepository.save(pro3);

        // SERVICES
        Service s1 = Service.builder().professional(pro1).name("Full-Stack Infrastructure Audit").description("Deep dive into your cloud infra and backend code.").price(750.0).priceLabel("$750 Fixed").duration("1 Week").build();
        Service s2 = Service.builder().professional(pro1).name("Microservices Migration").description("Porting legacy monoliths to Spring Boot microservices.").price(120.0).priceLabel("$120/hr").duration("Ongoing").build();
        Service s3 = Service.builder().professional(pro2).name("Premium Website Redesign").description("Modern, high-conversion UI/UX for your landing page.").price(1800.0).priceLabel("$1800 Fixed").duration("2 Weeks").build();
        Service s4 = Service.builder().professional(pro3).name("Custom Chatbot Integration").description("Integrating LLMs into your existing business workflow.").price(2500.0).priceLabel("$2500 Fixed").duration("3 Weeks").build();
        serviceRepository.save(s1);
        serviceRepository.save(s2);
        serviceRepository.save(s3);
        serviceRepository.save(s4);

        // JOBS
        Job j1 = Job.builder().poster(client).title("E-Commerce Scale-up").description("Scaling our backend to handle 1M+ users/day.").budget(15000.0).category("Web Development").skills(List.of("Redis", "Spring Boot", "PostgreSQL")).location("Remote").type("CONTRACT").status("OPEN").build();
        Job j2 = Job.builder().poster(admin).title("Internal HR Portal Design").description("Designing a dark-mode friendly HR management system.").budget(4000.0).category("UI/UX Design").skills(List.of("Figma", "Design Systems")).location("Vijayawada").type("PART_TIME").status("OPEN").build();
        Job j3 = Job.builder().poster(client).title("Mobile Banking App").description("React Native expert needed for a FinTech startup.").budget(8000.0).category("Mobile Apps").skills(List.of("React Native", "TypeScript")).location("New York").type("FULL_TIME").status("OPEN").build();
        jobRepository.save(j1);
        jobRepository.save(j2);
        jobRepository.save(j3);

        // HIRES
        Hire h1 = Hire.builder()
            .clientUser(client)
            .professional(pro1)
            .service(s1)
            .serviceTitle(s1.getName())
            .amountValue(750.0)
            .status("ONGOING")
            .progress(65)
            .notes("Phase 1 audit complete. Starting infra analysis.")
            .build();
        Hire h2 = Hire.builder()
            .clientUser(client)
            .professional(pro2)
            .service(s3)
            .serviceTitle(s3.getName())
            .amountValue(1800.0)
            .status("COMPLETED")
            .progress(100)
            .notes("Project delivered ahead of schedule. Great work!")
            .build();
        hireRepository.save(h1);
        hireRepository.save(h2);

        System.out.println("Comprehensive ProHire Database Seed Protocol Complete!");
    }
}
