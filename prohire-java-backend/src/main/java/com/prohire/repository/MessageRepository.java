package com.prohire.repository;

import com.prohire.model.Message;
import com.prohire.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtAsc(User u1, User u2, User u3, User u4);
<<<<<<< HEAD
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT m.receiver FROM Message m WHERE m.sender = :user")
    List<User> findReceiversByUser(User user);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver = :user")
    List<User> findSendersByUser(User user);
=======
    
    // Simpler for specific chat
    List<Message> findByReceiverOrderByCreatedAtDesc(User receiver);
>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb
}
