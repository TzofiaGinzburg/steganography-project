package com.photoServer.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
@Document(collection = "users")

public class User {
    @Id
    private String id;          // ת"ז
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String address;
    @JsonFormat(pattern = "yyyy-MM-dd") // זה יגרום לו לקבל את הפורמט מה-React

    private Date birthDate;
    private String username;
    private String password;
    @JsonProperty("userImage") // זה גורם ל-Java להבין ש-userImage מה-JS שייך לשדה הזה
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
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
