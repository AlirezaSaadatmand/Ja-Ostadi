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
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.Secret_Token))
}

func ParseJWT(tokenStr string) (jwt.MapClaims, error) {
    cfg := config.GetConfig()
    if tokenStr == "" {
        return nil, errors.New("missing token")
    }

    claims := jwt.MapClaims{}

    token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
        return []byte(cfg.Secret_Token), nil
    })
    if err != nil {
        return nil, err
    }

    if !token.Valid {
        return nil, errors.New("invalid token")
    }

    if exp, ok := claims["exp"].(float64); ok {
        if time.Unix(int64(exp), 0).Before(time.Now()) {
            return nil, errors.New("token expired")
        }
    }

    return claims, nil
}
