package com.photoServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "invitations")
public class Invitation {
    @Id
    private String id;
    private String groupName;
    private String invitedUsername;
    private String status; // "PENDING", "ACCEPTED"

    // Getters and Setters
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getInvitedUsername() { return invitedUsername; }
    public void setInvitedUsername(String invitedUsername) { this.invitedUsername = invitedUsername; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}