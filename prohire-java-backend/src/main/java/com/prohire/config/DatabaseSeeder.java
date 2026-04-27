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
import java.util.Arrays;

@Component
@RequiredArgsConstructor
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
            System.out.println("Database is already seeded.");
            return;
        }

        System.out.println("Seeding database with initial data...");

        // Users
        User admin = User.builder().email("admin@klu.in").password(passwordEncoder.encode("password")).fullName("Admin Overseer").role("ADMIN").isEmailVerified(true).build();
        Profile adminProfile = Profile.builder().user(admin).avatar("https://i.pravatar.cc/150?u=admin").bio("System Administrator").build();
        admin.setProfile(adminProfile);
        userRepository.save(admin);

        User client = User.builder().email("client@klu.in").password(passwordEncoder.encode("password")).fullName("Sarah Connor").role("USER").isEmailVerified(true).build();
        Profile clientProfile = Profile.builder().user(client).avatar("https://i.pravatar.cc/150?u=client").bio("Cyberdyne Systems Director").company("Cyberdyne").location("Los Angeles").build();
        client.setProfile(clientProfile);
        userRepository.save(client);

        User pro1User = User.builder().email("pro1@klu.in").password(passwordEncoder.encode("password")).fullName("Alex Vance").role("PROFESSIONAL").isEmailVerified(true).build();
        Profile pro1Profile = Profile.builder().user(pro1User).avatar("https://i.pravatar.cc/150?u=pro1").bio("Senior Full-Stack Engineer with 10 years experience").location("San Francisco").website("https://alexvance.dev").github("alexv").build();
        pro1User.setProfile(pro1Profile);
        userRepository.save(pro1User);

        User pro2User = User.builder().email("pro2@klu.in").password(passwordEncoder.encode("password")).fullName("Elena Fisher").role("PROFESSIONAL").isEmailVerified(true).build();
        Profile pro2Profile = Profile.builder().user(pro2User).avatar("https://i.pravatar.cc/150?u=pro2").bio("Lead UI/UX Designer and Frontend Specialist").location("London").twitter("@elenadesigns").build();
        pro2User.setProfile(pro2Profile);
        userRepository.save(pro2User);

        // Categories
        Category webCat = Category.builder().name("Web").description("Web Development").icon("🌐").build();
        Category designCat = Category.builder().name("Design").description("UI/UX Design").icon("🎨").build();
        Category aiCat = Category.builder().name("AI/ML").description("Artificial Intelligence").icon("🤖").build();
        categoryRepository.save(webCat);
        categoryRepository.save(designCat);
        categoryRepository.save(aiCat);

        // Professionals
        Professional pro1 = Professional.builder().user(pro1User).category(webCat).title("Senior Backend Architect").rateValue(120.0).skills(List.of("Java", "Spring Boot", "React", "AWS")).rating(4.9).reviewCount(120).build();
        professionalRepository.save(pro1);

        Professional pro2 = Professional.builder().user(pro2User).category(designCat).title("Lead UX Designer").rateValue(95.0).skills(List.of("Figma", "UI/UX", "TailwindCSS", "React")).rating(5.0).reviewCount(85).build();
        professionalRepository.save(pro2);

        // Services
        Service s1 = Service.builder().professional(pro1).name("Full-Stack Audit").description("Complete technical audit of your web application.").price(500.0).priceLabel("$500 Fixed").duration("1 Week").build();
        Service s2 = Service.builder().professional(pro1).name("API Development").description("Custom RESTful API development with Spring Boot.").price(120.0).priceLabel("$120/hr").duration("Ongoing").build();
        serviceRepository.save(s1);
        serviceRepository.save(s2);

        Service s3 = Service.builder().professional(pro2).name("UI/UX Redesign").description("Modern, premium redesign of your platform.").price(1500.0).priceLabel("$1500 Fixed").duration("2 Weeks").build();
        serviceRepository.save(s3);

        // Jobs
        Job j1 = Job.builder().poster(client).title("E-Commerce Platform Rebuild").description("Need a full-stack engineer to rebuild our legacy e-commerce platform using React and Spring Boot.").budget(10000.0).category("Web").skills(List.of("React", "Spring Boot", "MySQL")).location("Remote").type("CONTRACT").status("OPEN").build();
        Job j2 = Job.builder().poster(admin).title("Internal Dashboard Design").description("Looking for a UI/UX expert to design a high-fidelity dark-mode dashboard.").budget(3000.0).category("Design").skills(List.of("Figma", "Dark Mode", "Dashboard")).location("New York").type("PART_TIME").status("OPEN").build();
        jobRepository.save(j1);
        jobRepository.save(j2);

        // Hires
        Hire h1 = Hire.builder().clientUser(client).professional(pro1).service(s1).serviceTitle(s1.getName()).amountValue(500.0).status("ONGOING").progress(40).notes("Audit started on the legacy codebase.").build();
        hireRepository.save(h1);

        System.out.println("Database seeding completed!");
    }
}
