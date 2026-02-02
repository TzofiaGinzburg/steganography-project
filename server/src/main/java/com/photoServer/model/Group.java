package com.photoServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "groups")
public class Group {
    @Id
    private String id;
    private String name;
    private String creator;

    // השארנו רק רשימה אחת של Member
    private List<Member> members = new ArrayList<>();

    public Group() {}

    public Group(String name, String creator) {
        this.name = name;
        this.creator = creator;
        // בדרך כלל היוצר הוא גם החבר הראשון (ומנהל)
        this.members.add(new Member(creator, true));
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }
    public List<Member> getMembers() { return members; }
    public void setMembers(List<Member> members) { this.members = members; }

    // מחלקת עזר פנימית לחבר קבוצה
    public static class Member {
        private String username;
        private boolean isAdmin;

        public Member() {}
        public Member(String username, boolean isAdmin) {
            this.username = username;
            this.isAdmin = isAdmin;
        }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public boolean isAdmin() { return isAdmin; }
        public void setAdmin(boolean admin) { isAdmin = admin; }
    }
}