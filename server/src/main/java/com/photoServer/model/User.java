package com.photoServer.model;


import java.util.Date;

public class User {
    private long id;          // ת"ז
    private String firstName;
    private String lastName;
    private long phone;
    private String email;
    private String address;
    private Date birthDate;
    private String username;
    private String password;
    private String profileImage; // נשמור את התמונה כמחרוזת Base64 בשלב זה

    // קונסטרקטור ריק (חובה ל-Spring)

    // קונסטרקטור ריק - חובה!
    public User() {}

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getPhone() {
        return phone;
    }

    public void setPhone(long phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    // Getters and Setters - חשוב מאוד כדי ש-Spring יצליח לקרוא את הנתונים
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    // ... הוסיפי Getters ו-Setters לשאר השדות ...
}
