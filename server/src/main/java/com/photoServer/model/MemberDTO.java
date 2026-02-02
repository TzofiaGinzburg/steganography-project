package com.photoServer.model;

public class MemberDTO {
    private String username;
    private boolean isAdmin;

    // Getters and Setters - זה מה שיפתור את השגיאה ב-getUsername()
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }
}