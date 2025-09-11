package token

import (
	"errors"
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(userID uint, email string) (string, error) {
	cfg := config.GetConfig()
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(24 * time.Second).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.Secret_Token))
}

func ParseJWT(tokenStr string) (*jwt.Token, error) {
	cfg := config.GetConfig()
	if tokenStr == "" {
		return nil, errors.New("missing token")
	}

	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		return []byte(cfg.Secret_Token), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return token, nil
}
