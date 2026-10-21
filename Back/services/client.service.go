package services

import (
	"errors"
	"strings"
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/hashing"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrUsernameExists     = errors.New("username already exists")
	ErrWeakPassword       = errors.New("password too weak")
	ErrInvalidUsername    = errors.New("invalid username")
	ErrInvalidRole        = errors.New("invalid role")
	ErrClientNotFound     = errors.New("client not found")
)

func (s *Services) GetClient(username string) (*models.Client, error) {
	var client models.Client
	err := database.DB.Where("username = ?", username).First(&client).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrClientNotFound
	}
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get client", map[logging.ExtraKey]interface{}{
			"username": username,
			"error":    err.Error(),
		})
		return nil, errors.New("database error")
	}
	return &client, nil
}

func (s *Services) CreateClient(client *models.Client) error {
	var existingClient models.Client
	err := database.DB.Where("username = ?", client.Username).First(&existingClient).Error
	if err == nil {
		return ErrUsernameExists
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to check existing client", map[logging.ExtraKey]interface{}{
			"username": client.Username,
			"error":    err.Error(),
		})
		return errors.New("database error")
	}

	if err := database.DB.Create(client).Error; err != nil {
		if isDuplicateKey(err) {
			return ErrUsernameExists
		}
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to create client", map[logging.ExtraKey]interface{}{
			"username": client.Username,
			"error":    err.Error(),
		})
		return errors.New("failed to create client")
	}

	s.Logger.Info(logging.Mysql, logging.Insert, "client created successfully", map[logging.ExtraKey]interface{}{
		"clientID": client.ID,
		"username": client.Username,
		"role":     client.Role,
	})
	return nil
}

func (s *Services) RegisterClient(username, password string) (*models.Client, error) {
	username = strings.ToLower(strings.TrimSpace(username))

	if len(username) < 3 || len(username) > 32 {
		return nil, ErrInvalidUsername
	}
	if len(password) < 8 {
		return nil, ErrWeakPassword
	}

	var existing models.Client
	err := database.DB.Where("username = ?", username).First(&existing).Error
	if err == nil {
		return nil, ErrUsernameExists
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to check existing client", map[logging.ExtraKey]interface{}{
			"username": username,
			"error":    err.Error(),
		})
		return nil, errors.New("database error")
	}

	hashed, err := hashing.HashPassword(password)
	if err != nil {
		s.Logger.Error(logging.Auth, logging.Generate, "Failed to hash password", map[logging.ExtraKey]interface{}{
			"username": username,
			"error":    err.Error(),
		})
		return nil, errors.New("failed to create client")
	}

	client := &models.Client{
		Username: username,
		Password: hashed,
		Role:     "client",
	}

	if err := database.DB.Create(client).Error; err != nil {
		if isDuplicateKey(err) {
			return nil, ErrUsernameExists
		}
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to create client", map[logging.ExtraKey]interface{}{
			"username": username,
			"error":    err.Error(),
		})
		return nil, errors.New("failed to create client")
	}

	s.Logger.Info(logging.Mysql, logging.Insert, "client registered successfully", map[logging.ExtraKey]interface{}{
		"clientID": client.ID,
		"username": client.Username,
		"role":     client.Role,
	})
	return client, nil
}

func (s *Services) UpdateClient(id uint, updateData *models.Client) (*models.Client, error) {
	var client models.Client
	err := database.DB.First(&client, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		s.Logger.Warn(logging.Mysql, logging.Select, "client not found for update", map[logging.ExtraKey]interface{}{
			"clientID": id,
		})
		return nil, ErrClientNotFound
	}
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to find client", map[logging.ExtraKey]interface{}{
			"clientID": id,
			"error":    err.Error(),
		})
		return nil, errors.New("database error")
	}

	if updateData.Username != "" && updateData.Username != client.Username {
		var existingClient models.Client
		err := database.DB.Where("username = ?", updateData.Username).First(&existingClient).Error
		if err == nil {
			return nil, ErrUsernameExists
		}
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			s.Logger.Error(logging.Mysql, logging.Select, "Failed to check existing username", map[logging.ExtraKey]interface{}{
				"username": updateData.Username,
				"error":    err.Error(),
			})
			return nil, errors.New("database error")
		}
		client.Username = updateData.Username
	}

	if updateData.Password != "" {
		client.Password = updateData.Password
	}
	if updateData.Role != "" {
		client.Role = updateData.Role
	}

	if err := database.DB.Save(&client).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Update, "Failed to update client", map[logging.ExtraKey]interface{}{
			"clientID": id,
			"error":    err.Error(),
		})
		return nil, errors.New("failed to update client")
	}

	s.Logger.Info(logging.Mysql, logging.Update, "client updated successfully", map[logging.ExtraKey]interface{}{
		"clientID": id,
		"username": client.Username,
		"role":     client.Role,
	})
	return &client, nil
}

func (s *Services) DeleteClient(id uint) error {
	result := database.DB.Delete(&models.Client{}, id)
	if result.Error != nil {
		s.Logger.Error(logging.Mysql, logging.Delete, "Failed to delete client", map[logging.ExtraKey]interface{}{
			"clientID": id,
			"error":    result.Error.Error(),
		})
		return errors.New("failed to delete client")
	}
	if result.RowsAffected == 0 {
		return ErrClientNotFound
	}
	s.Logger.Info(logging.Mysql, logging.Delete, "client deleted successfully", map[logging.ExtraKey]interface{}{
		"clientID": id,
	})
	return nil
}

func (s *Services) AuthenticateClient(username, password string) (string, error) {
	var client models.Client
	err := database.DB.Where("username = ?", username).First(&client).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		s.Logger.Warn(logging.Auth, logging.Verify, "Client not found", map[logging.ExtraKey]interface{}{
			"username": username,
		})
		return "", ErrInvalidCredentials
	}
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to retrieve client", map[logging.ExtraKey]interface{}{
			"username": username,
			"error":    err.Error(),
		})
		return "", errors.New("database error")
	}

	if err := hashing.ComparePassword(client.Password, password); err != nil {
		s.Logger.Warn(logging.Auth, logging.Verify, "Invalid password", map[logging.ExtraKey]interface{}{
			"username": username,
		})
		return "", ErrInvalidCredentials
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"clientID": client.ID,
		"username": client.Username,
		"role":     client.Role,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	cfg := config.GetConfig()
	tokenString, err := token.SignedString([]byte(cfg.Secret_Token))
	if err != nil {
		s.Logger.Error(logging.Auth, logging.Generate, "Failed to generate JWT token", map[logging.ExtraKey]interface{}{
			"clientID": client.ID,
			"error":    err.Error(),
		})
		return "", errors.New("failed to generate token")
	}

	s.Logger.Info(logging.Auth, logging.Login, "Client authenticated successfully", map[logging.ExtraKey]interface{}{
		"clientID": client.ID,
		"username": client.Username,
	})
	return tokenString, nil
}

func isDuplicateKey(err error) bool {
	msg := err.Error()
	return strings.Contains(msg, "Duplicate entry") ||
		strings.Contains(msg, "UNIQUE constraint failed") ||
		strings.Contains(msg, "duplicate key value")
}