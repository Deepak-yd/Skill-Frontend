package com.prohire.repository;

import com.prohire.model.Connection;
import com.prohire.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findBySender(User sender);
    List<Connection> findByReceiver(User receiver);
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Connection c WHERE (c.sender = :u1 OR c.receiver = :u2) AND c.status = :status")
    List<Connection> findFriends(@org.springframework.data.repository.query.Param("u1") User u1, @org.springframework.data.repository.query.Param("u2") User u2, @org.springframework.data.repository.query.Param("status") String status);
    
    List<Connection> findByReceiverOrderByCreatedAtDesc(User receiver);
    
    // For friends (either sender or receiver with status ACCEPTED)
    List<Connection> findBySenderOrReceiverAndStatus(User sender, User receiver, String status);
}
