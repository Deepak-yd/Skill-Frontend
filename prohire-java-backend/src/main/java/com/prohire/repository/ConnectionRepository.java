package com.prohire.repository;

import com.prohire.model.Connection;
import com.prohire.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findBySender(User sender);
    List<Connection> findByReceiver(User receiver);
    List<Connection> findBySenderAndStatus(User sender, String status);
    List<Connection> findByReceiverAndStatus(User receiver, String status);
    
    // For friends (either sender or receiver with status ACCEPTED)
    List<Connection> findBySenderOrReceiverAndStatus(User sender, User receiver, String status);
}
