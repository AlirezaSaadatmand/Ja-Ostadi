package hashing

import (
	"errors"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	if password == "" {
		return "", errors.New("password cannot be empty")
	}
	
	if len(password) < 8 {
		return "", errors.New("password must be at least 8 characters")
	}
	
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", errors.New("failed to hash password")
	}
	
	return string(hashedPassword), nil
}

func ComparePassword(hashedPassword, password string) error {
	if hashedPassword == "" || password == "" {
		return errors.New("password and hash cannot be empty")
	}
	
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		if err == bcrypt.ErrMismatchedHashAndPassword {
			return errors.New("invalid password")
		}
		return errors.New("failed to verify password")
	}
	
	return nil
}
