package com.photoServer.model;



import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "invitations")
public class GroupInvitation {
    @Id
    private String id;
    private String groupName;
    private String invitedUsername; // שם החבר שהוזמן (למי להבהב?)
    private String inviterUsername; // מי שלח את ההזמנה
    private String status; // "PENDING", "ACCEPTED", "REJECTED"

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getInvitedUsername() {
        return invitedUsername;
    }

    public void setInvitedUsername(String invitedUsername) {
        this.invitedUsername = invitedUsername;
    }

    public String getInviterUsername() {
        return inviterUsername;
    }

    public void setInviterUsername(String inviterUsername) {
        this.inviterUsername = inviterUsername;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
// חובה להוסיף Getters ו-Setters (או להשתמש ב-Lombok)
}