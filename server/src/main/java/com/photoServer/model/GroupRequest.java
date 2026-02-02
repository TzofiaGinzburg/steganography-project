package com.photoServer.model;

import java.util.List;

public class GroupRequest {
    private String groupName;
    private String creator;
    private List<MemberDTO> invitedMembers; // עדכון הטיפוס ל-MemberDTO

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }
    public List<MemberDTO> getInvitedMembers() { return invitedMembers; }
    public void setInvitedMembers(List<MemberDTO> invitedMembers) { this.invitedMembers = invitedMembers; }
}
