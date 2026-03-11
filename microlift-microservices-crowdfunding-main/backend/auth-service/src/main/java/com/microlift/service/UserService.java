package com.microlift.service;

import com.microlift.entity.User;

public interface UserService {
    User getUserByEmail(String email);
}
